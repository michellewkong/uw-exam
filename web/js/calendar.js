
			var clientId = '469234392713-simdmu4rn98f6jqf27ouucef249s696o.apps.googleusercontent.com';
			var scopes = 'https://www.googleapis.com/auth/plus.me';
			var apiKey = 'voltaic-plating-534';
			
			function handleClientLoad() {
        	// Step 2: Reference the API key
        	gapi.client.setApiKey(apiKey);
        	window.setTimeout(checkAuth,1);
      		}
      		
      		
      		function checkAuth() {
        		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
      		}
			
			function handleAuthResult(authResult) {
        	var authorizeButton = document.getElementById('authorize-button');
        	if (authResult && !authResult.error) {
          		authorizeButton.style.visibility = 'hidden';
          		makeApiCall();
        	} else {
          		authorizeButton.style.visibility = '';
          		authorizeButton.onclick = handleAuthClick;
        		}
      		}

		
		   function handleAuthClick(event) {
        	// Step 3: get authorization to use private data
        		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
        	return false;
      		}
		
			function makeApiCall() {
			 	gapi.client.load('calendar', 'v1');
			}	
				