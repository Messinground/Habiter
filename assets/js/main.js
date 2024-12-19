// This makes sure the user can access their Drive/Tasks data on every page

let GoogleAuth;

function initClient() {
  gapi.client.init({
    clientId: '174513512206-jh0l34tmq7bc4p9it8ihjj066jp9fen3.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/tasks'
  }).then(() => {
    GoogleAuth = gapi.auth2.getAuthInstance();
    updateSigninStatus(GoogleAuth.isSignedIn.get());
    GoogleAuth.isSignedIn.listen(updateSigninStatus);
  });
}

function updateSigninStatus(isSignedIn) {
  const authButtons = document.getElementById('authButtons');
  if (isSignedIn) {
    authButtons.innerHTML = '<button onclick="handleSignOutClick()">Sign Out</button>';
  } else {
    authButtons.innerHTML = '<button onclick="handleSignInClick()">Sign In</button>';
  }
}

function handleSignInClick() {
  GoogleAuth.signIn();
}

function handleSignOutClick() {
  GoogleAuth.signOut();
}

// Load the API client and OAuth library
gapi.load('client:auth2', initClient);
