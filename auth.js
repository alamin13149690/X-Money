// ✅ Firebase Initialization
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Redirect if not logged in (for protected pages)
auth.onAuthStateChanged(user => {
  if (!user && window.location.pathname !== "/login.html") {
    window.location.href = "login.html";
  }
});

// ✅ Login Function
function login(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

// ✅ Signup Function
function signup(email, password) {
  return auth.createUserWithEmailAndPassword(email, password).then(userCred => {
    // Optional: create Firestore user profile
    return db.collection("users").doc(userCred.user.uid).set({
      email,
      wallet: 0,
      vipLevel: 0,
      joined: new Date().toISOString()
    });
  });
}

// ✅ Logout Function
function logout() {
  return auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// ✅ Get Current User Info
function getCurrentUser() {
  return auth.currentUser;
}