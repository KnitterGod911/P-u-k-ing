import { initCommon } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  initChatPage();
});

window.addEventListener('pageChanged', event => {
  if (event.detail.page === 'chat') {
    initChatPage();
  }
});

function initChatPage() {

  const overlay = document.getElementById('chatNameOverlay');
  const nameInput = document.getElementById('chatUsernameInput');
  const overlayForm = document.getElementById('chatNameForm');
  const banNotice = document.getElementById('banNotice');
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
  const callActionBtn = document.getElementById('callActionBtn');
  const endCallBtn = document.getElementById('endCallBtn');
  const callStatus = document.getElementById('callStatus');
  const callParticipants = document.getElementById('callParticipants');
  const localVideo = document.getElementById('localVideo');

  const usernameKey = 'pukChatUsername';
  const messagesKey = 'pukChatMessages';
  const groupKey = 'pukChatGroup';
  const callStateKey = 'pukChatCallState';
  const banListKey = 'pukBanList';

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

  function loadCallState() {
    try {
      return JSON.parse(localStorage.getItem(callStateKey) || 'null');
    } catch {
      return null;
    }
  }

  function saveCallState(state) {
    localStorage.setItem(callStateKey, JSON.stringify(state));
  }

  function clearCallState() {
    localStorage.removeItem(callStateKey);
  }

  function loadBans() {
    try {
      return JSON.parse(localStorage.getItem(banListKey) || '[]');
    } catch {
      return [];
    }
  }

  function cleanBans() {
    const now = new Date();
    const bans = loadBans().filter(ban => new Date(ban.expiresAt) > now);
    localStorage.setItem(banListKey, JSON.stringify(bans));
    return bans;
  }

  function isBanned(username) {
    return cleanBans().some(ban => ban.username === username);
  }

  function setActiveGroup(group) {
    currentGroup = group;
    localStorage.setItem(groupKey, group);
    groupButtons.forEach(button => {
      const isPrivateTab = button.dataset.group === 'private' && group.startsWith('private:');
      button.classList.toggle('active', button.dataset.group === group || isPrivateTab);
    });
    renderMessages();
    updateOnlineCount();
    updateChatHeader();
    renderCallStatus();
  }

  function updateOnlineCount() {
    const messages = loadMessages().filter(msg => msg.group === currentGroup);
    const uniqueUsers = new Set(messages.map(msg => msg.name));
    onlineCount.textContent = Math.max(1, uniqueUsers.size).toString();
  }

  function getCallState() {
    const state = loadCallState();
    if (!state || state.group !== currentGroup || !state.active) return null;
    return state;
  }

  function renderMessages() {
    if (!messageFeed) return;
    const groupMessages = loadMessages().filter(msg => msg.group === currentGroup);
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

  function updateChatHeader() {
    const username = getUsername() || 'Guest';
    if (chatUserBadge) {
      chatUserBadge.textContent = username.slice(0, 2).toUpperCase();
    }
    if (chatUserName) {
      chatUserName.textContent = username;
    }
  }

  function updateBanNotice() {
    if (!banNotice) return;
    const username = getUsername();
    const ban = cleanBans().find(item => item.username === username);
    if (ban) {
      banNotice.textContent = `Banned until ${new Date(ban.expiresAt).toLocaleString()}. Reason: ${ban.reason}`;
      banNotice.classList.remove('hidden');
      chatInput?.setAttribute('disabled', 'true');
      chatSendBtn?.setAttribute('disabled', 'true');
      return;
    }
    banNotice.textContent = '';
    banNotice.classList.add('hidden');
    chatInput?.removeAttribute('disabled');
    chatSendBtn?.removeAttribute('disabled');
  }

  function addMessage(text) {
    const name = getUsername();
    if (!name || !text.trim()) return;
    if (isBanned(name)) {
      updateBanNotice();
      return;
    }
    const messages = loadMessages();
    messages.push({
      name,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      group: currentGroup
    });
    saveMessages(messages);
    renderMessages();
    updateOnlineCount();
  }

  function renderCallStatus() {
    const callState = getCallState();
    if (!callState) {
      updateCallStatus('No active call.');
      if (callActionBtn) {
        callActionBtn.textContent = 'Start Call';
        callActionBtn.disabled = false;
      }
      renderCallParticipants();
      return;
    }

    const user = getUsername();
    const joined = callState.participants.includes(user);
    updateCallStatus(`${callState.mode === 'video' ? 'Video' : 'Voice'} call active in ${currentGroup.replace('private:', 'Private room ')}.`);
    if (callActionBtn) {
      callActionBtn.textContent = joined ? 'In Call' : 'Join Call';
      callActionBtn.disabled = joined;
    }
    renderCallParticipants();
  }

  function renderCallParticipants() {
    if (!callParticipants) return;
    const state = getCallState();
    if (!state) {
      callParticipants.innerHTML = '<p class="call-participant-empty">No one in the call yet.</p>';
      return;
    }
    callParticipants.innerHTML = state.participants.map(name => `
      <div class="call-participant${name === getUsername() ? ' active' : ''}">
        <strong>${name}</strong>
        <span>${name === getUsername() ? 'you' : 'participant'}</span>
      </div>
    `).join('');
  }

  async function startCall(mode) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice and video calls require a supported browser.');
      return;
    }

    const username = getUsername();
    if (!username) {
      alert('Please enter your name before starting a call.');
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
      const callState = {
        active: true,
        mode,
        group: currentGroup,
        startedBy: username,
        participants: [username]
      };
      saveCallState(callState);
      if (endCallBtn) {
        endCallBtn.classList.remove('hidden');
        endCallBtn.disabled = false;
      }
      if (callActionBtn) {
        callActionBtn.textContent = 'In Call';
        callActionBtn.disabled = true;
      }
      if (voiceCallBtn) voiceCallBtn.disabled = true;
      if (videoCallBtn) videoCallBtn.disabled = true;
      renderCallStatus();
    } catch (error) {
      console.error(error);
      alert('Unable to access camera or microphone. Please allow the browser permission.');
    }
  }

  function joinActiveCall() {
    const state = getCallState();
    const username = getUsername();
    if (!state || !username || state.participants.includes(username)) return;
    state.participants.push(username);
    saveCallState(state);
    renderCallStatus();
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
    clearCallState();
    renderCallStatus();
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
  callActionBtn?.addEventListener('click', () => {
    if (!callActionBtn) return;
    if (callActionBtn.textContent.includes('Join')) {
      joinActiveCall();
      callActionBtn.textContent = 'In Call';
      callActionBtn.disabled = true;
      updateCallStatus('Connected to the call.');
    }
  });
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
    updateChatHeader();
    updateBanNotice();
    setActiveGroup(currentGroup);
    renderMessages();
  });

  chatSendBtn?.addEventListener('click', handleSend);
  chatInput?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  });

  function syncState() {
    renderMessages();
    updateOnlineCount();
    renderCallStatus();
    updateBanNotice();
  }

  window.addEventListener('storage', event => {
    if ([messagesKey, groupKey, callStateKey, banListKey].includes(event.key)) {
      syncState();
    }
  });

  const storedName = getUsername();
  if (!storedName) {
    showOverlay(true);
  } else {
    showOverlay(false);
    updateChatHeader();
    updateBanNotice();
    setActiveGroup(currentGroup);
    renderMessages();
    renderCallStatus();
  }
}
