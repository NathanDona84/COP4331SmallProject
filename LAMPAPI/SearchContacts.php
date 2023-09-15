<?php

	$inData = getRequestInfo();
	$data = $inData["data"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$attr = "";
		if($data == 1)
			$attr = "FirstName";
		else if($data == 2)
			$attr = "LastName";
		else if($data == 3)
			$attr = "Phone";
		else if($data == 4)
			$attr = "Email";
		$value = "%" . $inData["value"] . "%";
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? AND " . $attr . " LIKE ?");
		$stmt->bind_param("ss", $inData["userID"], $value);
		$stmt->execute();
		$result = $stmt->get_result();
		$searchCount = 0;
		$searchResults = "";
		while($row = $result->fetch_assoc()){
			if($searchCount > 0){
				$searchResults .= ", ";
			}
			$searchResults .= '[' . '"'.$row["ID"].'"' . ', ' . '"'.$row["FirstName"].'"' . ', ' . '"'.$row["LastName"].'"' . ', ' 
								. '"'.$row["Phone"].'"' . ', ' .  '"'.$row["Email"].'"' . ']';
			$searchCount++;
		}
		
		if( $searchCount == 0 ){
			$retValue = '{"data": -1, "error": "no records found"}';
			sendResultInfoAsJson($retValue);
		}
		else{
			returnWithInfo($searchResults);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results": [' . $searchResults . ']}';
		sendResultInfoAsJson( $retValue );
	}
	
?>