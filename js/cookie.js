
function saveCookie() {
    var minutes = 20;
    var date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    var data = document.cookie;
    var splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        var thisOne = splits[i].trim();
        var tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    // if user is present (userid > 0) and theyre on the login or register page, then redirect to contacts page
    if ((window.location.href.includes("index") || window.location.href.includes("register")) && userID > 0) {
        window.location.href = "contacts.html";
    }

    // check if user logged in; if user isn't logged in (userId < 0) and on contacts page, redirect to login
    if (window.location.href.includes("contacts") && userId < 0) {
        window.location.href = "index.html"
    }
}
