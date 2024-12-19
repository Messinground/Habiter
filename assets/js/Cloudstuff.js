// Cloudstuff.js

const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/tasks';

let idToken = null;
let accessToken = null;
let tokenClient;

/**
 * Decodes the given ID token (JWT) to extract user info.
 * @param {string} token The ID token returned by GIS.
 * @returns {Object} The decoded JWT payload (user info).
 */
function decodeJwtResponse(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
}

/**
 * Called by GIS when the user signs in successfully.
 * Receives an ID token that identifies the user.
 * We then request an access token for API calls and update the UI.
 */
function handleCredentialResponse(response) {
  // This should run when the user selects an account from the GIS button
  idToken = response.credential;
  const payload = decodeJwtResponse(idToken);
  const userName = payload.name || payload.email;
  console.log("Signed in as:", userName);

  updateStatusMessage(`Signed in as ${userName}!`);

  // Request an access token for the desired APIs
  tokenClient.requestAccessToken({ prompt: '' });

  // Show the sign-out button now that user is signed in
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.style.display = 'inline-block';
  }
}
window.handleCredentialResponse = handleCredentialResponse; // Make sure it's global

/**
 * Updates the status message text to reflect signed-in or signed-out state.
 * @param {string} message The message to display.
 */
function updateStatusMessage(message) {
  const statusMsg = document.getElementById('statusMessage');
  if (statusMsg) {
    statusMsg.textContent = message;
  } else {
    console.log("statusMessage element not found!");
  }
}

/**
 * Initializes the GAPI client, needed to call Google APIs like Drive/Tasks.
 * After initialization, sets up the token client for obtaining access tokens.
 */
function initGapiClient() {
  return gapi.client.init({}).then(() => {
    console.log('GAPI client initialized');
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
      },
    });
  });
}

/**
 * Handles sign-out logic:
 * - Clears tokens
 * - Updates UI to "Signed out."
 * - Hides the sign-out button
 */
function handleSignOutClick() {
  idToken = null;
  accessToken = null;
  gapi.client.setToken(null);

  // Update status message to show the user is signed out
  updateStatusMessage("Signed out.");

  // Hide the sign-out button
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.style.display = 'none';
  }

  console.log("User signed out");
}

// Initialize the GAPI client once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  gapi.load('client', initGapiClient);
});
