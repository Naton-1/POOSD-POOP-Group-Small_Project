var urlBase = 'http://group1-cop4331.ddns.net/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {

    // get text entries
    var email = document.getElementById("loginName").value;
    var password = document.getElementById("loginPassword").value;
    var hash = md5(password); // make hash of password

    // check login
    if (checkLogin(email, password)) {
        return;
    }

    // initialize err msg to ""
    document.getElementById("loginResult").innerHTML = "";

    // store email and hashed password in json
    var jsonPayload = JSON.stringify({ "email": email, "password": hash });
    var url = urlBase + '/login.' + extension;

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
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = jsonObject.error;
                    return;
                }

                firstName = jsonObject.firstname;
                lastName = jsonObject.lastname;
                saveCookie();
                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload); // send json
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// checks if missing field in text box
function checkLogin(email, password) {
    if (email == undefined || email == "" || password == undefined || password == "") {
        document.getElementById("loginResult").innerHTML = "Missing a field. Please try again.";
        if (email == undefined || email == "") {
            document.getElementById("loginName").classList.add('error');
        }
        if (password == undefined || password == "") {
            document.getElementById("loginPassword").classList.add('error');
        }

        return 1;
    }
    else {
        document.getElementById("loginName").classList.remove('error');
        document.getElementById("loginPassword").classList.remove('error');
        return 0;
    }
}
