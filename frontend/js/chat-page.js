import { initCommon } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommon();

  const overlay = document.getElementById('chatNameOverlay');
  const nameInput = document.getElementById('chatUsernameInput');
  const overlayForm = document.getElementById('chatNameForm');
  const messageFeed = document.getElementById('messageFeed');
  const chatInput = document.getElementById('chatMessageInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const onlineCount = document.getElementById('onlineCount');
  const chatUserBadge = document.getElementById('chatUserBadge');
  const chatUserName = document.getElementById('chatUserName');

  const usernameKey = 'pukChatUsername';
  const messagesKey = 'pukChatMessages';

  function getUsername() {
    return localStorage.getItem(usernameKey);
  }

  function setUsername(value) {
    localStorage.setItem(usernameKey, value);
  }

  function loadMessages() {
    return JSON.parse(localStorage.getItem(messagesKey) || '[]');
  }

  function saveMessages(messages) {
    localStorage.setItem(messagesKey, JSON.stringify(messages));
  }

  function updateOnlineCount() {
    const messages = loadMessages();
    const uniqueUsers = new Set(messages.map(msg => msg.name));
    onlineCount.textContent = Math.max(1, uniqueUsers.size).toString();
  }

  function renderMessages() {
    const messages = loadMessages();
    if (!messageFeed) return;
    messageFeed.innerHTML = messages.map(msg => {
      const alignClass = msg.name === getUsername() ? 'mine' : '';
      return `
        <div class="chat-message ${alignClass}">
          <div class="chat-meta"><strong>${msg.name}</strong><small>${msg.time}</small></div>
          <p>${msg.text}</p>
        </div>
      `;
    }).join('');
    messageFeed.scrollTop = messageFeed.scrollHeight;
  }

  function showOverlay(show = true) {
    if (!overlay) return;
    overlay.classList.toggle('hidden', !show);
  }

  function resetChatHeader() {
    const username = getUsername() || 'Guest';
    if (chatUserBadge) {
      chatUserBadge.textContent = username.slice(0, 2).toUpperCase();
    }
    if (chatUserName) {
      chatUserName.textContent = username;
    }
  }

  function addMessage(text) {
    const name = getUsername();
    if (!name || !text.trim()) return;
    const messages = loadMessages();
    const message = {
      name,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    messages.push(message);
    saveMessages(messages);
    renderMessages();
    updateOnlineCount();
  }

  function handleSend() {
    if (!chatInput) return;
    addMessage(chatInput.value);
    chatInput.value = '';
  }

  overlayForm?.addEventListener('submit', event => {
    event.preventDefault();
    const value = nameInput?.value.trim();
    if (!value) return;
    setUsername(value);
    showOverlay(false);
    resetChatHeader();
    renderMessages();
    updateOnlineCount();
  });

  chatSendBtn?.addEventListener('click', handleSend);
  chatInput?.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  });

  const storedName = getUsername();
  if (!storedName) {
    showOverlay(true);
  } else {
    showOverlay(false);
    resetChatHeader();
    renderMessages();
    updateOnlineCount();
  }
});
