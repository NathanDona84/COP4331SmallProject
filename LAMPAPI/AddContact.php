<?php
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName=? AND LastName=? AND Phone=? AND Email=? AND UserID=?");
		$stmt->bind_param("sssss", $inData["first"], $inData["last"], $inData["phone"], $inData["email"], $inData["userID"]);
		$stmt->execute();
		$result = $stmt->get_result();
        $row = $result->fetch_assoc();
		
		if($row){
			$retValue = '{"data": -1, "error": "contact already exists"}';
			sendResultInfoAsJson($retValue);
		}
		else{
			$stmt = $conn->prepare("INSERT INTO Contacts (FirstName,LastName,Phone,Email,UserID) VALUES (?,?,?,?,?)");
			$stmt->bind_param("sssss", $inData["first"], $inData["last"], $inData["phone"], $inData["email"], $inData["userID"]);
			$stmt->execute();
			$retValue = '{"data": 1}';
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