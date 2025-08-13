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

// ✅ Auth Check (Redirect if not logged in)
auth.onAuthStateChanged(user => {
  if (!user) {
    if (window.location.pathname !== "/login.html") {
      window.location.href = "login.html";
    }
  }
});

// ✅ Deposit Submission
function submitDeposit(method, amount, trxId) {
  const user = auth.currentUser;
  if (!amount || !trxId || amount < 50 || amount > 20000) return;

  return db.collection("deposits").add({
    uid: user.uid,
    email: user.email,
    method,
    amount,
    trxId,
    status: "pending",
    time: new Date().toISOString()
  });
}

// ✅ Withdraw Submission
function submitWithdraw(method, amount, number) {
  const user = auth.currentUser;
  if (!amount || !number || amount < 100) return;

  return db.collection("withdrawals").add({
    uid: user.uid,
    email: user.email,
    method,
    amount,
    number,
    status: "pending",
    time: new Date().toISOString()
  });
}

// ✅ Game Logging
function logGame(gameId, result, reward, extra = {}) {
  const user = auth.currentUser;
  const data = {
    uid: user.uid,
    email: user.email,
    gameId,
    result,
    reward,
    time: new Date().toISOString(),
    ...extra
  };
  return db.collection("games").add(data);
}

// ✅ Dashboard Loader
function loadDashboard(uid, callback) {
  const profile = {};
  db.collection("users").doc(uid).get().then(doc => {
    const data = doc.data();
    profile.vipLevel = data.vipLevel || 0;
    profile.wallet = data.wallet || 0;
    callback(profile);
  });
}

// ✅ Recent Games
function loadRecentGames(uid, limit = 5) {
  return db.collection("games").where("uid", "==", uid).orderBy("time", "desc").limit(limit).get();
}

// ✅ Deposits & Withdrawals
function loadDeposits(uid, limit = 3) {
  return db.collection("deposits").where("uid", "==", uid).orderBy("time", "desc").limit(limit).get();
}
function loadWithdrawals(uid, limit = 3) {
  return db.collection("withdrawals").where("uid", "==", uid).orderBy("time", "desc").limit(limit).get();
}