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
        $stmt = $conn->prepare("SELECT firstname, lastname, email, phonenumber, dateofcreation FROM Contacts WHERE userid=? AND fullname LIKE ?");
        $fullName = "%" . $inData["searchquery"] . "%";
        $stmt->bind_param("ss", $inData["userid"], $fullName);
        $stmt->execute();

        $result = $stmt->get_result();

        // Check if the search is valid
        if ($row = $result->fetch_assoc()) {

            returnWithInfo($row['id'], $row['firstname'], $row['lastname'], $row['email'], $row['phonenumber'], $row['dateofcreation']);
        }
        else {
            returnWithError("Search failed.");
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

    // return information from SQL query
    function returnWithInfo($firstName, $lastName, $email, $phoneNumber, $dateOfCreation) {
        $retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","phoneNumber":"' . $phoneNumber . '","dateOfCreation":"' . $dateOfCreation .'", "error":""}';
        sendResultInfoAsJson($retValue);
    }
?>