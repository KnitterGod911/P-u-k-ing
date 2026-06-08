import { auth, db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const messageFeed = document.getElementById('messageFeed');
const chatMessageInput = document.getElementById('chatMessageInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const onlineCount = document.getElementById('onlineCount');

let currentUser = null;
let unsubscribe = null;
let onlineUsers = new Set();

function renderMessages(messages) {
  messageFeed.innerHTML = messages.map(msg => `
    <div class="chat-message ${msg.uid === currentUser?.uid ? 'mine' : ''}">
      <div class="chat-meta"><strong>${msg.username || 'Anonymous'}</strong><small>${msg.timestamp}</small></div>
      <p>${msg.content}</p>
    </div>
  `).join('');
  messageFeed.scrollTop = messageFeed.scrollHeight;
}

function formatTimestamp(ts) {
  return ts?.toDate ? ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function postMessage() {
  const content = chatMessageInput.value.trim();
  if (!content || !currentUser) return;
  const msg = {
    uid: currentUser.uid,
    username: currentUser.displayName || currentUser.email.split('@')[0],
    content,
    createdAt: serverTimestamp(),
    moderation: { flagged: false, reviewed: false }
  };
  await addDoc(collection(db, 'messages'), msg);
  chatMessageInput.value = '';
  const stored = Number(localStorage.getItem('pukMessagesSent') || '0') + 1;
  localStorage.setItem('pukMessagesSent', stored);
}

function bindChatEvents() {
  chatSendBtn.addEventListener('click', postMessage);
  chatMessageInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') postMessage();
  });
}

function connectChatActivity() {
  if (!currentUser) return;
  if (unsubscribe) unsubscribe();
  const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
  unsubscribe = onSnapshot(messagesQuery, snapshot => {
    const messages = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        uid: data.uid,
        username: data.username,
        content: data.content,
        timestamp: formatTimestamp(data.createdAt)
      });
    });
    renderMessages(messages);
  });
}

function updateOnlineCount() {
  onlineCount.textContent = onlineUsers.size.toString();
}

function initGroupChat() {
  bindChatEvents();
  onAuthStateChanged(auth, user => {
    currentUser = user;
    if (user) {
      onlineUsers.add(user.uid);
      updateOnlineCount();
      connectChatActivity();
      const presenceDoc = doc(db, 'presence', user.uid);
      setDoc(presenceDoc, { activeAt: serverTimestamp(), username: user.displayName || user.email.split('@')[0] });
    }
  });
}

export { initGroupChat, connectChatActivity };
