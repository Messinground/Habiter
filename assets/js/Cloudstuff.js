// Cloudstuff.js

// Scopes for the APIs you want to access
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/tasks';

let tokenClient;
let idToken = null;
let accessToken = null;


// Called by GIS after the user signs in
function handleCredentialResponse(response) {
  idToken = response.credential;
  const payload = decodeJwtResponse(idToken);
  const userName = payload.name || payload.email;
  console.log("Signed in as:", userName,"  ");

  // Now request the access token
  tokenClient.requestAccessToken({ prompt: '' });

  // Update UI to reflect signed in user as soon as we have the ID token
  showSignedInUI(userName);
}
window.handleCredentialResponse = handleCredentialResponse; // Make sure this is global

function decodeJwtResponse(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
}

function showSignedInUI(userName) {
  // Hide the Google Sign-In button
  const signInButtonDiv = document.querySelector('.g_id_signin');
  if (signInButtonDiv) {
    signInButtonDiv.style.display = 'none';
  }

  // Show user info and sign-out button
  const authButtons = document.getElementById('authButtons');
  if (authButtons) {
    authButtons.innerHTML = `
      <span>Signed in as ${userName}</span>
      <button onclick="handleSignOutClick()">Sign Out</button>
    `;
  }
}


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

function handleSignOutClick() {
  idToken = null;
  accessToken = null;
  gapi.client.setToken(null);

  // Disable auto select so that next load doesn't show the user's name automatically
  google.accounts.id.disableAutoSelect();

  // Show the sign-in button again
  const signInButtonDiv = document.querySelector('.g_id_signin');
  if (signInButtonDiv) {
    signInButtonDiv.style.display = 'block';
  }

  // Clear the UI
  const authButtons = document.getElementById('authButtons');
  if (authButtons) {
    authButtons.innerHTML = '';
  }

  console.log("User signed out");
}


// Initialize gapi client after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  gapi.load('client', initGapiClient);
});
