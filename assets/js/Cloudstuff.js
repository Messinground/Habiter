// Cloudstuff.js

// Scopes for the APIs you want to access
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/tasks';

let tokenClient;
let idToken = null;
let accessToken = null;

// Called by GIS after the user signs in
function handleCredentialResponse(response) {
  // response.credential is the ID token
  idToken = response.credential;
  console.log("ID Token acquired:", idToken);

  // Now request an access token for the desired scopes
  tokenClient.requestAccessToken({ prompt: '' });
}
window.handleCredentialResponse = handleCredentialResponse; // Make sure this is global

function initGapiClient() {
  // Initialize the gapi client (not auth2)
  return gapi.client.init({}).then(() => {
    console.log('GAPI client initialized');

    // Initialize OAuth token client for access tokens
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: '174513512206-jh0l34tmq7bc4p9it8ihjj066jp9fen3.apps.googleusercontent.com',
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          console.error('Error getting access token:', tokenResponse.error);
          return;
        }
        accessToken = tokenResponse.access_token;
        gapi.client.setToken({ access_token: accessToken });
        console.log("Access token acquired:", accessToken);
        updateSigninStatus(true);
      },
    });
  });
}

function updateSigninStatus(isSignedIn) {
  const authButtons = document.getElementById('authButtons');
  if (!authButtons) return;

  if (isSignedIn) {
    authButtons.innerHTML = '<button onclick="handleSignOutClick()">Sign Out</button>';
  } else {
    authButtons.innerHTML = '';
  }
}

function handleSignOutClick() {
  // GIS does not have a direct "sign out" because tokens are stateless.
  // To "sign out":
  // 1. Clear our stored tokens
  // 2. Reset the UI
  idToken = null;
  accessToken = null;
  gapi.client.setToken(null);
  updateSigninStatus(false);
}

// Initialize gapi client after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  gapi.load('client', initGapiClient);
});
