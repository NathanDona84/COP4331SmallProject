<?php
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=?");
		$stmt->bind_param("s", $inData["id"]);
		$stmt->execute();
		$result = $stmt->get_result();
        $row = $result->fetch_assoc();
		
		if($row){
            $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
		    $stmt->bind_param("s", $inData["id"]);
		    $stmt->execute();
			$retValue = '{"data": 1}';
			sendResultInfoAsJson($retValue);
		}
		else{
			$retValue = '{"data": -1, "error": "contact does not exist"}';
			sendResultInfoAsJson($retValue);
		}
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>