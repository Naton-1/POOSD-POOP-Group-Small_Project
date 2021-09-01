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
        // for ease require all fields, just rewrite same data
        if (missingFields($inData)) {
            // doesn't include all fields, return an error
            returnWithError("All fields are required.");
        }
        else {
            // create sql prepared statement to updae contact in DB
            $stmt = $conn->prepare("UPDATE Contacts SET firstname=?, lastname=?, email=?, phonenumber=? WHERE userid=?");

            // bind the input into the prepared statement
            $stmt->bind_param("sssss", $inData["firstname"], $inData["lastname"], $inData["email"], $inData["phonenumber"], $inData["userid"]);

            // execute the prepared statement
            $stmt->execute();

            // check if error occurs
            if ($stmt->errno) {
                // return error json with the error
                returnWithError($stmt->error);
            }
            
            // return a json stating update was a success (no error occurred)
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
        sendResultInfoAsJson('{"status": success, "message": "Update Successful."}');
    }

    // checks if all input fields exist, return true if any are missing
    function missingFields($fields) {
        return (!$inData["firstname"] && !$inData["lastname"] && !$inData["email"] && !$inData["phonenumber"] && !$inData["userid"]);
    }
?>