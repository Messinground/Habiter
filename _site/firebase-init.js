// firebase-init.js

//This makes sure that users can login using the google-powered firebase database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqv4Fnuf9IjBjHXyXCTIx1_IjUSgJvUyQ",
  authDomain: "habiter-deea9.firebaseapp.com",
  projectId: "habiter-deea9",
  storageBucket: "habiter-deea9.firebasestorage.app",
  messagingSenderId: "984200158976",
  appId: "1:984200158976:web:b33be79a4a6cf84a2f1de5",
  measurementId: "G-VSHGRYK13T"

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

