<?php
    // get json from frontend
    $inData = getRequestInfo();    

    // connect to database
    $conn = new mysqli("localhost", "dbuser", getenv("SQL_PW"), "smallproject");

    // check database connection status
    if ($conn->connect_error) {
        // return DB error
        returnWithError($conn->connect_error);
    }
    else {
        // DB connection was successful

        // Prepare SQL statement and bind parameters
        $stmt = $conn->prepare("SELECT id, firstname, lastname FROM Users WHERE email=? AND password=?");
        $stmt->bind_param("ss", $inData["email"], $inData["password"]);
        $stmt->execute();

        $result = $stmt->get_result();

        // Check if the login is valid
        if ($row = $result->fetch_assoc()) {
            $stmt = $conn->prepare("UPDATE Users SET datelastloggedin = CURRENT_TIMESTAMP() WHERE email=? AND password=?");
            $stmt->bind_param("ss", $inData["email"], $inData["password"]);
            $stmt->execute();

            returnSuccess($inData["id"]);
        }
        else {
            returnWithError("Login failed.");
        }

        $stmt->close();
    }

    // close database connection
    $conn->close();

    // get input from front end and decode json
    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    // return object to front end with json type
    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }
    
    // return an error to the front end with error message
    function returnWithError($err) {
        $retValue = '{"status": "error", "message": "' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    // return json stating that the login was successful
    function returnSuccess($id) {
        sendResultInfoAsJson('{"status": "success", "id": "' . $id . '", "message": "Login Successful."}');
    }
?>