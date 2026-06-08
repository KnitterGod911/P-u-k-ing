import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_FIREBASE_PROJECT.firebaseapp.com',
  projectId: 'YOUR_FIREBASE_PROJECT_ID',
  storageBucket: 'YOUR_FIREBASE_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, firebaseConfig };
