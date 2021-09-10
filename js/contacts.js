// READ COOKIE
// readCookie();

// search for term entered in search field
function doSearch() {
    var searchBar = document.getElementById("searchBar");
    var searchTerm = searchBar.value;

    // TODO: spicy code goes here
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
    editButton.onclick = function() { showEditModal(contactId); }
    editButtonTD.appendChild(editButton);
    row.appendChild(editButtonTD);

    // delete button
    var deleteButtonTD = document.createElement("td");
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>&nbsp;Delete';
    deleteButton.classList.add("button");
    deleteButton.title = "Delete Contact";
    deleteButton.onclick = function() { showDeleteModal(contactId); }
    deleteButtonTD.appendChild(deleteButton);
    row.appendChild(deleteButtonTD);

    tableBody.appendChild(row);

}

function deleteContact(contactId) {
    // delete from row
    var tableBody = document.querySelector("#table tbody");
    var row = document.getElementById(`contact${contactId}`);
    tableBody.removeChild(row);

    // TODO: API CALL delete from DB

    hideDeleteModal();
}

function addContact() {
    var firstname = document.getElementById("addFirstName").value;
    var lastname = document.getElementById("addLastName").value;
    var email = document.getElementById("addEmail").value;
    var phone = document.getElementById("addPhone").value;

    if (undefinedOrEmpty(firstname) || undefinedOrEmpty(lastname) || undefinedOrEmpty(email) || undefinedOrEmpty(phone)) {
        
        // add error text
        document.getElementById("addContactResult").innerHTML = "Missing or empty field";

        // add error state to each text box that needs it
        if (undefinedOrEmpty(firstName)) {
            document.getElementById("addFirstName").classList.add('error');
        }
        if (undefinedOrEmpty(lastName)) {
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

    addContactToTable(firstname, lastname, phone, email, 5);

    // TODO: API CALL

    hideAddModal();
}

function undefinedOrEmpty(str) {
    return str == undefined || str == "";
}

function updateContact(contactId) {
    var firstname = document.getElementById("editFirstName").value;
    var lastname = document.getElementById("editLastName").value;
    var email = document.getElementById("editEmail").value;
    var phone = document.getElementById("editPhone").value;

    if (undefinedOrEmpty(firstname) || undefinedOrEmpty(lastname) || undefinedOrEmpty(email) || undefinedOrEmpty(phone)) {

        // add error text
        document.getElementById("editContactResult").innerHTML = "Missing or empty field";

        // add error state to each text box that needs it
        if (undefinedOrEmpty(firstName)) {
            document.getElementById("editFirstName").classList.add('error');
        }
        if (undefinedOrEmpty(lastName)) {
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

    document.querySelector(`#contact${contactId} :nth-child(1)`).innerHTML = firstname + " " + lastname;
    document.querySelector(`#contact${contactId} :nth-child(2)`).innerHTML = email;
    document.querySelector(`#contact${contactId} :nth-child(3)`).innerHTML = phone;

    // TODO: API CALL

    hideEditModal();
}

// shows add modal on click
function showAddModal() {
    var modal = document.getElementById("add-modal");
    modal.style.display = "flex";

    document.getElementById("addModalButton").onclick = function () {
        addContact();
    }
}

// shows edit modal on click
function showEditModal(contactId) {
    var modal = document.getElementById("edit-modal");
    modal.style.display = "flex";

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