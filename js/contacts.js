var urlBase = 'http://group1-cop4331.ddns.net/LAMPAPI';
var extension = 'php';

// search for term entered in search field
function doSearch() {
    var searchBar = document.getElementById("searchBar");
    var searchTerm = searchBar.value;

    var jsonPayload = JSON.stringify({ "userid": userId, "searchterm": searchTerm });
    var url = urlBase + '/search.' + extension;

    // make HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // send json
    try {
        // wait for response
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                // parse response
                var jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.status == "error") {
                    document.getElementById("searchResult").innerHTML = jsonObject.message;
                    return;
                }

                // clear current table
                document.querySelector("#table tbody").innerHTML = "";
                searchBar.value = "";

                // put data in HTML
                var arr = jsonObject.results;
                arr.forEach(element => {
                    addContactToTable(element.firstname, element.lastname, element.phonenumber, element.email, element.id);
                });
            }
        };
        xhr.send(jsonPayload); // send json
    }
    catch (err) {
        document.getElementById("searchResult").innerHTML = err.message;
    }

}

// adds contact to html table
function addContactToTable(firstname, lastname, phonenumber, email, contactId) {
    var tableBody = document.querySelector("#table tbody");

    var row = document.createElement("tr");
    row.id = `contact${contactId}`;

    // populate name td
    var nameTD = document.createElement("td");
    nameTD.innerHTML = firstname + " " + lastname;
    row.appendChild(nameTD);

    // populate email td
    var emailTD = document.createElement("td");
    emailTD.innerHTML = email;
    row.appendChild(emailTD);

    // populate phone td
    var phoneTD = document.createElement("td");
    phoneTD.innerHTML = phonenumber;
    row.appendChild(phoneTD);

    // edit button
    var editButtonTD = document.createElement("td");
    var editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>&nbsp;Edit';
    editButton.classList.add("button");
    editButton.title = "Edit Contact";
    editButton.onclick = function () { showEditModal(contactId); }
    editButtonTD.appendChild(editButton);
    row.appendChild(editButtonTD);

    // delete button
    var deleteButtonTD = document.createElement("td");
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>&nbsp;Delete';
    deleteButton.classList.add("delete-button");
    deleteButton.title = "Delete Contact";
    deleteButton.onclick = function () { showDeleteModal(contactId); }
    deleteButtonTD.appendChild(deleteButton);
    row.appendChild(deleteButtonTD);

    tableBody.appendChild(row);

}

function deleteContact(contactId) {

    // start API CALL delete from DB
    var jsonPayload = JSON.stringify({ "id": contactId });
    var url = urlBase + '/deleteContact.' + extension;

    // make HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // send json
    try {
        // wait for response
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                // parse response
                var jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.status == "error") {
                    document.getElementById("deleteContactResult").innerHTML = jsonObject.message;
                    return;
                }

                // delete from row
                var tableBody = document.querySelector("#table tbody");
                var row = document.getElementById(`contact${contactId}`);
                tableBody.removeChild(row);

                // close modal
                hideDeleteModal();
            }
        };
        xhr.send(jsonPayload); // send json
    }
    catch (err) {
        document.getElementById("deleteContactResult").innerHTML = err.message;
    }
}

function addContact() {
    var firstname = document.getElementById("addFirstName").value;
    var lastname = document.getElementById("addLastName").value;
    var email = document.getElementById("addEmail").value;
    var phone = document.getElementById("addPhone").value;

    // clear error display
    document.getElementById("addFirstName").classList.remove('error');
    document.getElementById("addLastName").classList.remove('error');
    document.getElementById("addEmail").classList.remove('error');
    document.getElementById("addPhone").classList.remove('error');
    
    if (undefinedOrEmpty(firstname) || undefinedOrEmpty(lastname) || undefinedOrEmpty(email) || undefinedOrEmpty(phone)) {
        // add error text
        document.getElementById("addContactResult").innerHTML = "Missing or empty field";

        // add error state to each text box that needs it
        if (undefinedOrEmpty(firstname)) {
            document.getElementById("addFirstName").classList.add('error');
        }
        if (undefinedOrEmpty(lastname)) {
            document.getElementById("addLastName").classList.add('error');
        }
        if (undefinedOrEmpty(email)) {
            document.getElementById("addEmail").classList.add('error');
        }
        if (undefinedOrEmpty(phone)) {
            document.getElementById("addPhone").classList.add('error');
        }

        return;
    }
    else if (hasWhitespace(firstname) || hasWhitespace(lastname) || hasWhitespace(email) || hasWhitespace(phone)) {

        // add error text
        document.getElementById("addContactResult").innerHTML = "No spaces allowed. Please try again.";

        // add error state to each text box that needs it
        if (hasWhitespace(firstname)) {
            document.getElementById("addFirstName").classList.add('error');
        }
        if (hasWhitespace(lastname)) {
            document.getElementById("addLastName").classList.add('error');
        }
        if (hasWhitespace(email)) {
            document.getElementById("addEmail").classList.add('error');
        }
        if (hasWhitespace(phone)) {
            document.getElementById("addPhone").classList.add('error');
        }

        return;
    }


    var jsonPayload = JSON.stringify({ "firstname": firstname, "lastname": lastname, "phonenumber": phone, "email": email, "userid": userId });
    var url = urlBase + '/insertContact.' + extension;

    // make HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // send json
    try {
        // wait for response
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                // parse response
                var jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.status == "error") {
                    document.getElementById("addContactResult").innerHTML = jsonObject.message;
                    return;
                }

                // put data in HTML
                addContactToTable(firstname, lastname, phone, email, 5);

                // close modal
                hideAddModal();
            }
        };
        xhr.send(jsonPayload); // send json
    }
    catch (err) {
        document.getElementById("addContactResult").innerHTML = err.message;
    }
}

function undefinedOrEmpty(str) {
    return str == undefined || str == "";
}

function hasWhitespace(str) {
    return /\s/g.test(str);
}

function updateContact(contactId) {
    var firstname = document.getElementById("editFirstName").value;
    var lastname = document.getElementById("editLastName").value;
    var email = document.getElementById("editEmail").value;
    var phone = document.getElementById("editPhone").value;

    // clear error display
    document.getElementById("editFirstName").classList.remove('error');
    document.getElementById("editLastName").classList.remove('error');
    document.getElementById("editEmail").classList.remove('error');
    document.getElementById("editPhone").classList.remove('error');

    if (undefinedOrEmpty(firstname) || undefinedOrEmpty(lastname) || undefinedOrEmpty(email) || undefinedOrEmpty(phone)) {

        // add error text
        document.getElementById("editContactResult").innerHTML = "Missing or empty field";
        // add error state to each text box that needs it
        if (undefinedOrEmpty(firstname)) {
            document.getElementById("editFirstName").classList.add('error');
        }
        if (undefinedOrEmpty(lastname)) {
            document.getElementById("editLastName").classList.add('error');
        }
        if (undefinedOrEmpty(email)) {
            document.getElementById("editEmail").classList.add('error');
        }
        if (undefinedOrEmpty(phone)) {
            document.getElementById("editPhone").classList.add('error');
        }

        return;
    }
    else if (hasWhitespace(firstname) || hasWhitespace(lastname) || hasWhitespace(email) || hasWhitespace(phone)) {

        // add error text
        document.getElementById("editContactResult").innerHTML = "No spaces allowed. Please try again.";

        // add error state to each text box that needs it
        if (hasWhitespace(firstname)) {
            document.getElementById("editFirstName").classList.add('error');
        }
        if (hasWhitespace(lastname)) {
            document.getElementById("editLastName").classList.add('error');
        }
        if (hasWhitespace(email)) {
            document.getElementById("editEmail").classList.add('error');
        }
        if (hasWhitespace(phone)) {
            document.getElementById("editPhone").classList.add('error');
        }

        return;
    }

    // API CALL to update edited contact
    var jsonPayload = JSON.stringify({ "firstname": firstname, "lastname": lastname, "phonenumber": phone, "email": email, "id": contactId });
    var url = urlBase + '/updateContact.' + extension;

    // make HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // send json
    try {
        // wait for response
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                // parse response
                var jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.status == "error") {
                    document.getElementById("editContactResult").innerHTML = jsonObject.message;
                    return;
                }

                // put data in HTML
                document.querySelector(`#contact${contactId} :nth-child(1)`).innerHTML = firstname + " " + lastname;
                document.querySelector(`#contact${contactId} :nth-child(2)`).innerHTML = email;
                document.querySelector(`#contact${contactId} :nth-child(3)`).innerHTML = phone;

                // close modal
                hideEditModal();
            }
        };
        xhr.send(jsonPayload); // send json
    }
    catch (err) {
        document.getElementById("editContactResult").innerHTML = err.message;
    }

}

// shows add modal on click
function showAddModal() {
    var modal = document.getElementById("add-modal");
    modal.style.display = "flex";

    // on show, make sure empty form
    document.getElementById("addContactResult").innerHTML = "";
    document.getElementById("addFirstName").value = "";
    document.getElementById("addFirstName").classList.remove("error");
    document.getElementById("addLastName").value = "";
    document.getElementById("addLastName").classList.remove("error");
    document.getElementById("addEmail").value = "";
    document.getElementById("addEmail").classList.remove("error");
    document.getElementById("addPhone").value = "";
    document.getElementById("addPhone").classList.remove("error");


    document.getElementById("addModalButton").onclick = function () {
        addContact();
    }
}

// shows edit modal on click
function showEditModal(contactId) {
    var modal = document.getElementById("edit-modal");
    modal.style.display = "flex";

    // make sure no errors on show
    document.getElementById("editContactResult").innerHTML = "";
    document.getElementById("editFirstName").classList.remove("error");
    document.getElementById("editLastName").classList.remove("error");
    document.getElementById("editEmail").classList.remove("error");
    document.getElementById("editPhone").classList.remove("error");

    // populate modal fields
    var name = document.querySelector(`#contact${contactId} :nth-child(1)`).innerHTML.split(" ");
    document.getElementById("editFirstName").value = name[0];
    document.getElementById("editLastName").value = name[1];
    document.getElementById("editEmail").value = document.querySelector(`#contact${contactId} :nth-child(2)`).innerHTML;
    document.getElementById("editPhone").value = document.querySelector(`#contact${contactId} :nth-child(3)`).innerHTML;

    document.getElementById("saveEditButton").onclick = function () {
        updateContact(contactId);
    }
}

// shows delete modal on click
function showDeleteModal(contactId) {
    var modal = document.getElementById("delete-modal");
    modal.style.display = "flex";

    // hide error
    document.getElementById("addContactResult").innerHTML = "";

    var contactInfo = document.querySelector(`#contact${contactId} :nth-child(1)`);
    document.getElementById("deleteContactInfo").innerHTML = contactInfo.innerHTML;

    document.getElementById("deleteConfirm").onclick = function () {
        deleteContact(contactId);
    }
}

// hides add modal on click
function hideAddModal() {
    var modal = document.getElementById("add-modal");
    modal.style.display = "none";
}

// hides edit modal on click
function hideEditModal() {
    var modal = document.getElementById("edit-modal");
    modal.style.display = "none";
}

// hides delete modal on click
function hideDeleteModal() {
    var modal = document.getElementById("delete-modal");
    modal.style.display = "none";
}