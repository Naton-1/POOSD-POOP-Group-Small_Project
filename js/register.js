var urlBase = 'http://group1-cop4331.ddns.net/LAMPAPI';
var extension = 'php';

function doRegister() {
    // get text entries
    var firstName = document.getElementById("registerFirstName").value;
    var lastName = document.getElementById("registerLastName").value;
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    // reset errors
    document.getElementById("registerFirstName").classList.remove('error');
    document.getElementById("registerLastName").classList.remove('error');
    document.getElementById("registerEmail").classList.remove('error');
    document.getElementById("registerPassword").classList.remove('error');
    document.getElementById("confirmPassword").classList.remove('error');
    
    document.getElementById("registerResult").innerHTML = "";
    
    // check register
    if (checkRegister(firstName, lastName, email, password, confirmPassword)) {
        return;
    }

    // store email and hashed password in json
    var jsonPayload = JSON.stringify({ 
        "firstname": firstName,
        "lastname": lastName,
        "email": email,
        "password": md5(password)
    });
    var url = urlBase + '/register.' + extension;

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
                var status = jsonObject.status;
                
                // check error here
                if (status === "error") {
                    document.getElementById("registerResult").innerHTML = jsonObject.message;
                    return;
                }
                
                window.location.href = "index.html";
            }
        };
        xhr.send(jsonPayload); // send json
    }
    catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }
}


function checkRegister(firstName, lastName, email, password, confirmPassword) {
    if (undefinedOrEmpty(firstName) || undefinedOrEmpty(lastName) || undefinedOrEmpty(email) || undefinedOrEmpty(password) || undefinedOrEmpty(confirmPassword)) {
        document.getElementById("registerResult").innerHTML = "Missing a field. Please try again.";
        if (undefinedOrEmpty(firstName)) {
            document.getElementById("registerFirstName").classList.add('error');
        }
        if (undefinedOrEmpty(lastName)) {
            document.getElementById("registerLastName").classList.add('error');
        }
        if (undefinedOrEmpty(email)) {
            document.getElementById("registerEmail").classList.add('error');
        }
        if (undefinedOrEmpty(password)) {
            document.getElementById("registerPassword").classList.add('error');
        }
        if (undefinedOrEmpty(confirmPassword)) {
            document.getElementById("confirmPassword").classList.add('error');
        }

        return 1;
    }
    else if (hasWhitespace(firstName) || hasWhitespace(lastName) || hasWhitespace(email) || hasWhitespace(password) || hasWhitespace(confirmPassword)) {
        document.getElementById("registerResult").innerHTML = "No spaces allowed. Please try again.";
        if (hasWhitespace(firstName)) {
            document.getElementById("registerFirstName").classList.add('error');
        }
        if (hasWhitespace(lastName)) {
            document.getElementById("registerLastName").classList.add('error');
        }
        if (hasWhitespace(email)) {
            document.getElementById("registerEmail").classList.add('error');
        }
        if (hasWhitespace(password)) {
            document.getElementById("registerPassword").classList.add('error');
        }
        if (hasWhitespace(confirmPassword)) {
            document.getElementById("confirmPassword").classList.add('error');
        }

        return 1;
    }
    else {
        document.getElementById("registerFirstName").classList.remove('error');
        document.getElementById("registerLastName").classList.remove('error');
        document.getElementById("registerEmail").classList.remove('error');
        document.getElementById("registerPassword").classList.remove('error');
        document.getElementById("confirmPassword").classList.remove('error');

        // Check if both passwords are the same
        if (password != confirmPassword) {
            document.getElementById("registerResult").innerHTML = "Passwords are not the same. Try again.";
            document.getElementById("registerPassword").classList.add('error');
            document.getElementById("confirmPassword").classList.add('error');

            return 1;
        }

        return 0;
    }
}

function undefinedOrEmpty(str) {
    return str == undefined || str == "";
}

function hasWhitespace(str) {
    return /\s/g.test(str);
}