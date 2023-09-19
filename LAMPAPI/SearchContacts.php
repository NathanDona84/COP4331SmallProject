<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$attr = ["FirstName", "LastName", "Phone", "Email"];
		$value = "%" . $inData["search"] . "%";
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? AND " . $attr[0] . " LIKE ? OR " . $attr[1] . 
								" LIKE ? OR ". $attr[2] . " LIKE ? OR " . $attr[3] . " LIKE ? ");
		$stmt->bind_param("sssss", $inData["userID"], $value, $value, $value, $value);
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
		$retValue = '{"data": 1, "results": [' . $searchResults . ']}';
		sendResultInfoAsJson( $retValue );
	}
	
?>