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
        // create sql prepared statement to delete contact from DB
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE id=?");
        
        // put input id in prepared statement
        $stmt->bind_param("s", $inData["id"]); 
        
        // execute the prepared statement
        $stmt->execute();

        // check if an error occurs
        if ($stmt->errno) {
            // return error json with the error
            returnWithError($stmt->errno);
        } 
        else {
            // return a json stating deletion was a success (no error occurred)
            returnSuccess();
        }
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

    // return json stating that the deletion was successful
    function returnSuccess() {
        sendResultInfoAsJson('{"status": "success", "message": "Deletion Successful."}');
    }
?>