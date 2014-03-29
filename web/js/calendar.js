var clientId = '469234392713-simdmu4rn98f6jqf27ouucef249s696o.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/calendar.readonly';
var apiKey = 'AIzaSyDr04aEIjqmeICdtpaT5dn2Uvn157u18j0';
    
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
    //authorizeButton.style.visibility = 'hidden';
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
    
function makeApiCall(){
    var resource = {
      "summary": "Appointment",
      "location": "here",
      "start": {
          "dateTime": "2014-03-30T10:00:00.000-05:00"
      },
      "end": {
        "dateTime": "2014-03-30T10:44:00.000-05:00"
      }

    };
    gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': resource
    });
          
    request.execute(function(resp) {
      console.log(resp);
      if (resp.id){
        alert("event added :)")
      }
    });
  });
}