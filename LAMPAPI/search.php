<?php
    // get json from frontend
    $inData = getRequestInfo();    

    $searchRes = "";
    $searchCount = 0;
    $userId = $inData["userid"];
    $search = "%" . $inData["searchterm"] . "%";

    // connect to database
    $conn = new mysqli("localhost", "dbuser", getenv("SQL_PW"), "smallproject");

    // check database connection status
    if ($conn->connect_error) {
        // return DB error
        returnWithError($conn->connect_error);
    }
    else {
         // Prepare SQL statement and bind parameters
         $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userid=? AND (firstname LIKE ? OR lastname LIKE ?) ORDER BY firstname, lastname");
         $stmt->bind_param("sss", $userId, $search, $search);
         $stmt->execute;

         $result = $stmt->get_result();


        // make result array by loop all rows
        while($row = $result->fetch_assoc()) {
            if($searchCount > 0) {
                $searchRes .= ",";
            }
            $searchCount++;
            $searchRes .= '{"id": "' . $row["id"] . '", "firstname": "' . $row["firstname"] . '", "lastname": "' . $row["lastname"] . '", "phone": "' . $row["phone"] . '", "email": "' . $row["email"] . '"}';
        }

        if ($searchCount == 0) {
            returnWithError("No Matches Found.");
        }
        else {
            returnWithInfo($searchRes);
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

    // returns success state
    function returnWithInfo($searchRes) {
        $retValue = '{"results":[' . $searchRes . '],"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>