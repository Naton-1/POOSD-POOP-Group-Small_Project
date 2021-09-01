<?php
    // get json from frontend
    $inData = getRequestInfo();    
    
    // get insert input from array
    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
    $email = $inData["email"];
    $phonenumber = $inData["phonenumber"];
    $userid = $inData["userid"];

    // connect to database
    $conn = new mysqli("localhost", "dbuser", getenv("SQL_PW"), "smallproject");

    // check database connection status
    if ($conn->connect_error) {
        // return DB error
        returnWithError($conn->connect_error);
    }
    else {
        // create sql prepared statement to insert contact into DB
        $stmt = $conn->prepare("INSERT INTO Contacts (firstname, lastname, email, phonenumber, userid) VALUES (?, ?, ?, ?, ?);");
        
        // bind the input into the prepared statement
        $stmt->bind_param("sssss", $firstname, $lastname, $email, $phonenumber, $userid);
        
        // execute the prepared statement
        $stmt->execute();

        // check if error occurs
        if ($stmt->errno) {
            // return error json with the error
            returnWithError($stmt->error);
        }
        else {
            // return a json stating insertion was a success (no error occurred)
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

    // return json stating that the insertion was successful
    function returnSuccess() {
        sendResultInfoAsJson('{"status": success, "message": "Insertion Successful."}');
    }
?>