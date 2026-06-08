import { auth, db } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { doc, setDoc, getDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const provider = new GoogleAuthProvider();
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleRegisterBtn = document.getElementById('toggleRegisterBtn');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const authMessage = document.getElementById('authMessage');
const authClose = document.getElementById('authClose');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');

let isRegisterMode = false;

function openAuthModal() {
  authModal.classList.remove('hidden');
}

function closeAuthModal() {
  authModal.classList.add('hidden');
  authMessage.textContent = '';
}

async function createUserProfile(user, extra = {}) {
  const userDoc = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userDoc);

  if (!snapshot.exists()) {
    await setDoc(userDoc, {
      displayName: user.displayName || extra.displayName || 'PUK user',
      email: user.email,
      avatar: user.photoURL || '',
      bio: 'Ready to explore PUK.',
      joinDate: serverTimestamp(),
      stats: { gamesPlayed: 0, messagesSent: 0, promptsSent: 0 }
    });
  }
}

async function updateUserProfile(user, data = {}) {
  const userDoc = doc(db, 'users', user.uid);
  await setDoc(userDoc, data, { merge: true });
  if (data.displayName || data.photoURL) {
    await updateProfile(user, {
      displayName: data.displayName || user.displayName,
      photoURL: data.photoURL || user.photoURL
    });
  }
}

async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    closeAuthModal();
  } catch (error) {
    authMessage.textContent = error.message;
  }
}

async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user);
    closeAuthModal();
  } catch (error) {
    authMessage.textContent = error.message;
  }
}

async function registerWithEmail(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user, { displayName: email.split('@')[0] });
    closeAuthModal();
  } catch (error) {
    authMessage.textContent = error.message;
  }
}

async function sendResetEmail(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    authMessage.textContent = 'Password reset email sent. Check your inbox.';
  } catch (error) {
    authMessage.textContent = error.message;
  }
}

function logoutUser() {
  return signOut(auth);
}

function initAuthListeners(onStateChanged) {
  onAuthStateChanged(auth, async user => {
    if (user) {
      await createUserProfile(user);
    }
    onStateChanged(user);
  });
}

function wireAuthEvents() {
  googleSignInBtn.addEventListener('click', loginWithGoogle);
  authClose.addEventListener('click', closeAuthModal);
  authModal.addEventListener('click', event => {
    if (event.target === authModal) closeAuthModal();
  });

  authForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    if (isRegisterMode) {
      registerWithEmail(email, password);
    } else {
      loginWithEmail(email, password);
    }
  });

  toggleRegisterBtn.addEventListener('click', () => {
    isRegisterMode = !isRegisterMode;
    authSubmitBtn.textContent = isRegisterMode ? 'Sign up' : 'Login';
    toggleRegisterBtn.textContent = isRegisterMode ? 'Login instead' : 'Sign up';
  });

  resetPasswordBtn.addEventListener('click', () => {
    const email = document.getElementById('authEmail').value.trim();
    if (!email) {
      authMessage.textContent = 'Enter your email to reset password.';
      return;
    }
    sendResetEmail(email);
  });
}

export { openAuthModal, closeAuthModal, logoutUser, initAuthListeners, updateUserProfile, createUserProfile, wireAuthEvents };
