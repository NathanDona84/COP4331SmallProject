const urlBase = 'http://cop4331-group24.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let editContactID = "";
let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	if(login.length < 1){
		document.getElementById("loginResult").innerHTML = "Username Cannot Be Empty";
		return;
	}
	if(password.length < 1){
		document.getElementById("loginResult").innerHTML = "Password Cannot Be Empty";
		return;
	}

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister(){

	userId = 0;
	firstName = "";
	lastName = "";
	
	let first = document.getElementById("registerFirstName").value;
	let last = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerName").value;
	let pass = document.getElementById("registerPassword").value;

	//var hash = md5( password );
	
	document.getElementById("registerResult").innerHTML = "";

	if(first.length < 1){
		document.getElementById("registerResult").innerHTML = "First Name Cannot Be Empty";
		return;
	}
	if(last.length < 1){
		document.getElementById("registerResult").innerHTML = "Last Name Cannot Be Empty";
		return;
	}
	if(login.length < 1){
		document.getElementById("registerResult").innerHTML = "Username Cannot Be Empty";
		return;
	}
	if(pass.length < 1){
		document.getElementById("registerResult").innerHTML = "Password Cannot Be Empty";
		return;
	}

	let tmp = {
		first: first,
		last: last,
		login: login,
		password: pass
	};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);
	
	let url = urlBase + '/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				
				if(userId < 1)
					document.getElementById("registerResult").innerHTML = "Username Taken";
				else
					document.getElementById("registerResult").innerHTML = "Account Created, Please Return to Login Page";
				return;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function searchContactAll(){
	document.getElementById("searchText").value = "";
	searchContact();
}

function searchContact()
{
	let value = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	

	let colorList = "";
	console.log(userId);
	let tmp = {
		search:value,
		userID:userId
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				if(jsonObject.results) {
					document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
					document.querySelector("#userTable thead").innerHTML = `
   					 <tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Phone Number</th>
						<th>Email</th>
						<th>Action</th>
					</tr>`;
				}
				else{
					document.getElementById("contactSearchResult").innerHTML = "No contacts found";
					document.querySelector("#userTable thead").innerHTML = ``;
				}

				var tableBody = document.querySelector("#userTable tbody");
				tableBody.innerHTML = "";


        // Iterate through the array and create table rows
        for (var i = 0; i < jsonObject.results.length; i++) {
            var rowData = jsonObject.results[i];
            var row = document.createElement("tr");

            for (var j = 1; j < rowData.length; j++) {
                var cell = document.createElement("td");
                cell.textContent = rowData[j];
                row.appendChild(cell);
            }

            // Create Edit and Delete buttons and add them to the Action column
            var actionCell = document.createElement("td");
            var editButton = document.createElement("button");
            var deleteButton = document.createElement("button");

			var editImage = document.createElement("img");
			editImage.src = "/../images/icons8-edit-24.png"

			var deleteImage = document.createElement("img");
			deleteImage.src = "/../images/icons8-delete-24.png"

			//sets the edit/delete button to the image above and gives the id to easily style
            editButton.appendChild(editImage)
			editButton.id = "editButton"

			deleteButton.id = "deleteButton"
            deleteButton.appendChild(deleteImage);

             (function (contactID, firstName, lastName, phoneNumber, email) 
			 	{
                    editButton.addEventListener("click", function () {
                        // Populate the modal input fields with the row data
                        document.getElementById("editFirstName").value = firstName;
                        document.getElementById("editLastName").value = lastName;
                        document.getElementById("editPhoneNumber").value = phoneNumber;
                        document.getElementById("editEmail").value = email;
						editContactID = contactID;
						console.log("contactID",contactID);
						console.log("editContactID",editContactID);
                        // Show the modal
                        editModal.style.display = "block";
                    });

                    deleteButton.addEventListener("click", function () {
                        // Ask for confirmation before deleting
                        if (confirm("Are you sure you want to delete this contact?")) {
                            // Call the doDelete() function with the contact ID when Delete is clicked
                            doDelete(contactID);
                        }
                    });
                })(rowData[0], rowData[1], rowData[2], rowData[3], rowData[4]);

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);
            tableBody.appendChild(row);

			document.getElementById("closeModal").addEventListener("click", function () {
            editModal.style.display = "none";
        });

        // Close the modal when clicking outside the modal
        window.addEventListener("click", function (event) {
            if (event.target === editModal) {
                editModal.style.display = "none";
            }
        });
        }

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	//resets span to empty string after searching again
	document.getElementById("contactUpdateResult").innerHTML = "";
}

//wip-do not delete!!
function editContact(contactInfo){
	let first = document.getElementById("editFirstName").value;
	let last = document.getElementById("editLastName").value;
	let phone = document.getElementById("editPhoneNumber").value;
	let email = document.getElementById("editEmail").value;

	//var hash = md5( password );
	
	document.getElementById("contactUpdateResult").innerHTML = "";

	if(first.length < 1){
		document.getElementById("contactUpdateResult").innerHTML = "First Name Cannot Be Empty";
		return;
	}
	if(last.length < 1){
		document.getElementById("contactUpdateResult").innerHTML = "Last Name Cannot Be Empty";
		return;
	}
	if(phone.length < 1 || phone.match(/\d/g).length != 10){
		document.getElementById("contactUpdateResult").innerHTML = "Invalid Phone Number";
		return;
	}
	if(email.length < 1 || !emailPattern.test(email)) {
		document.getElementById("contactUpdateResult").innerHTML = "Invalid Email Address";
		return;
	}

	let tmp = {
		first: first,
		last: last,
		phone:phone,
		email: email,
		id: editContactID
	};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);
	
	let url = urlBase + '/UpdateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				returnResult = jsonObject.data
				
				if(returnResult < 1)
					showOverlayBanner("Could not update contact", true);
				else{
					showOverlayBanner("Contact Updated!", false);
					searchContact();
				}
				return;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
	editModal.style.display = "none";
	
}

function addContact(){

	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	let first = document.getElementById("addFirstName").value;
	let last = document.getElementById("addLastName").value;
	let phone = document.getElementById("addPhoneNumber").value;
	let email = document.getElementById("addEmail").value;

	//var hash = md5( password );
	
	document.getElementById("contactAddResult").innerHTML = "";

	if(first.length < 1){
		document.getElementById("contactAddResult").innerHTML = "First Name Cannot Be Empty";
		return;
	}
	if(last.length < 1){
		document.getElementById("contactAddResult").innerHTML = "Last Name Cannot Be Empty";
		return;
	}
	if(phone.length < 1 || phone.match(/\d/g).length != 10){
		document.getElementById("contactAddResult").innerHTML = "Invalid Phone Number";
		return;
	}
	if(email.length < 1 || !emailPattern.test(email)) {
		document.getElementById("contactAddResult").innerHTML = "Invalid Email Address";
		return;
	}

	let tmp = {
		first: first,
		last: last,
		phone:phone,
		email: email,
		userID:userId
	};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);
	
	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				returnResult = jsonObject.data
				
				if(returnResult < 1)
					document.getElementById("contactAddResult").innerHTML = "Duplicate Contact";
				else
					document.getElementById("contactAddResult").innerHTML = "Contact Created!";
				return;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function doDelete(contactID) {

	let tmp = {id:contactID}
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);
	
	let url = urlBase + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				returnResult = jsonObject.data
				
				if(returnResult < 1)
					showOverlayBanner("Could not delete contact", true);
				else{
					showOverlayBanner("Contact Deleted!", false);
					searchContact();
				}
				return;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function showOverlayBanner(message, isError = false) {
    var overlayBanner = document.getElementById("overlayBanner");
    var bannerText = document.getElementById("bannerText");

    bannerText.textContent = message;
    overlayBanner.style.display = "block";

    // Add the "error" class if isError is true, else remove it
    if (isError) {
        overlayBanner.classList.add("error");
    } else {
        overlayBanner.classList.remove("error");
    }

    // Hide the overlay banner after 3 seconds
    setTimeout(function () {
        overlayBanner.style.display = "none";
    }, 2000); //2 seconds
}