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
        $stmt = $conn->prepare("SELECT id, firstname, lastname FROM Users WHERE email=?");
        $stmt->bind_param("s", $inData["email"]);
        $stmt->execute();

        $result = $stmt->get_result();

        // Check if an account with that email exists already
        if ($row = $result->fetch_assoc()) {
            // Duplicate account exists. Raise error.
            returnWithError("An account with that email exists already.");
        }
        else if (!empty($inData["firstname"]) && !empty($inData["lastname"]) && !empty($inData["email"]) && !empty($inData["password"])) {
            // Add account to database
            $stmt = $conn->prepare("INSERT INTO Users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["email"], $inData["password"]);
            $stmt->execute();
            
            returnSuccess();
        }
        else {
            returnWithError("Internal Server Error.");
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
        $retValue = '{"status": "error", "message":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnSuccess() {
        $retValue = '{"status": "success", "message": "Account created."}';
        sendResultInfoAsJson($retValue);
    }
?>