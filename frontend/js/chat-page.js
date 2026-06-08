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
  const groupButtons = Array.from(document.querySelectorAll('.group-tab'));
  const privateGroupForm = document.getElementById('privateGroupForm');
  const privateGroupInput = document.getElementById('privateGroupInput');
  const voiceCallBtn = document.getElementById('voiceCallBtn');
  const videoCallBtn = document.getElementById('videoCallBtn');
  const endCallBtn = document.getElementById('endCallBtn');
  const callStatus = document.getElementById('callStatus');
  const localVideo = document.getElementById('localVideo');

  const usernameKey = 'pukChatUsername';
  const messagesKey = 'pukChatMessages';
  const groupKey = 'pukChatGroup';

  let currentGroup = localStorage.getItem(groupKey) || 'public';
  let mediaStream = null;

  function getUsername() {
    return localStorage.getItem(usernameKey);
  }

  function setUsername(value) {
    localStorage.setItem(usernameKey, value);
  }

  function loadMessages() {
    const stored = JSON.parse(localStorage.getItem(messagesKey) || '[]');
    return stored.map(msg => ({ ...msg, group: msg.group || 'public' }));
  }

  function saveMessages(messages) {
    localStorage.setItem(messagesKey, JSON.stringify(messages));
  }

  function setActiveGroup(group) {
    currentGroup = group;
    localStorage.setItem(groupKey, group);
    groupButtons.forEach(button => {
      const isPrivateTab = button.dataset.group === 'private' && group.startsWith('private:');
      button.classList.toggle('active', button.dataset.group === group || isPrivateTab);
    });
    renderMessages();
  }

  function updateOnlineCount() {
    const messages = loadMessages().filter(msg => msg.group === currentGroup);
    const uniqueUsers = new Set(messages.map(msg => msg.name));
    onlineCount.textContent = Math.max(1, uniqueUsers.size).toString();
  }

  function renderMessages() {
    const groupMessages = loadMessages().filter(msg => msg.group === currentGroup);
    if (!messageFeed) return;
    messageFeed.innerHTML = groupMessages.map(msg => {
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

  function updateCallStatus(text) {
    if (callStatus) {
      callStatus.textContent = text;
    }
  }

  async function startCall(mode) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice and video calls require a supported browser.');
      return;
    }

    const constraints = mode === 'video'
      ? { audio: true, video: { width: 640, height: 480 } }
      : { audio: true, video: false };

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (localVideo) {
        localVideo.srcObject = mediaStream;
        localVideo.classList.toggle('hidden', mode !== 'video');
      }
      if (endCallBtn) {
        endCallBtn.classList.remove('hidden');
        endCallBtn.disabled = false;
      }
      updateCallStatus(`${mode === 'video' ? 'Video' : 'Voice'} call active in ${currentGroup.replace('private:', 'Private room ')}.`);
      if (voiceCallBtn) voiceCallBtn.disabled = true;
      if (videoCallBtn) videoCallBtn.disabled = true;
    } catch (error) {
      console.error(error);
      alert('Unable to access camera or microphone. Please allow the browser permission.');
    }
  }

  function endCall() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    if (localVideo) {
      localVideo.srcObject = null;
      localVideo.classList.add('hidden');
    }
    if (endCallBtn) {
      endCallBtn.classList.add('hidden');
      endCallBtn.disabled = true;
    }
    if (voiceCallBtn) voiceCallBtn.disabled = false;
    if (videoCallBtn) videoCallBtn.disabled = false;
    updateCallStatus('No active call.');
  }

  function addMessage(text) {
    const name = getUsername();
    if (!name || !text.trim()) return;
    const messages = loadMessages();
    const message = {
      name,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      group: currentGroup
    };
    messages.push(message);
    saveMessages(messages);
    renderMessages();
    updateOnlineCount();
  }

  groupButtons.forEach(button => {
    button.addEventListener('click', () => setActiveGroup(button.dataset.group));
  });

  privateGroupForm?.addEventListener('submit', event => {
    event.preventDefault();
    const roomName = privateGroupInput?.value.trim();
    if (!roomName) return;
    setActiveGroup(`private:${roomName}`);
    privateGroupInput.value = '';
  });

  voiceCallBtn?.addEventListener('click', () => startCall('voice'));
  videoCallBtn?.addEventListener('click', () => startCall('video'));
  endCallBtn?.addEventListener('click', endCall);

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
    setActiveGroup(currentGroup);
    renderMessages();
    updateOnlineCount();
  }
});
