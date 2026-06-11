import { addActivity } from './games.js';

const aiChatBox = document.getElementById('aiChatBox');
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const newChatBtn = document.getElementById('newChatBtn');

let conversation = JSON.parse(localStorage.getItem('pukAIHistory') || '[]');

function saveAIHistory() {
  localStorage.setItem('pukAIHistory', JSON.stringify(conversation));
}

function renderAIChat() {
  aiChatBox.innerHTML = conversation.map(entry => `
    <div class="message ${entry.role}">
      <div class="message-meta"><span>${entry.role === 'user' ? 'You' : 'PUK AI'}</span><small>${entry.time}</small></div>
      <p>${entry.text}</p>
    </div>
  `).join('');
  aiChatBox.scrollTop = aiChatBox.scrollHeight;
}

function addAIHistoryEntry(role, text) {
  conversation.push({ role, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  saveAIHistory();
  renderAIChat();
}

async function sendPrompt(prompt) {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) return;
  addAIHistoryEntry('user', trimmedPrompt);
  aiInput.value = '';
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message assistant typing';
  typingIndicator.innerHTML = '<div class="message-meta"><span>PUK AI</span><small>typing...</small></div><p>Processing...</p>';
  aiChatBox.appendChild(typingIndicator);
  aiChatBox.scrollTop = aiChatBox.scrollHeight;

  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmedPrompt })
    });
    const data = await response.json();
    typingIndicator.remove();
    if (response.ok && data.answer) {
      addAIHistoryEntry('assistant', data.answer);
      addActivity('AI prompt sent');
    } else {
      const fallback = data.error || 'AI service unavailable. Try again or ask a simple question.';
      addAIHistoryEntry('assistant', fallback);
    }
  } catch (error) {
    typingIndicator.remove();
    const fallbackAnswer = `I can't reach AI right now, but I heard you: "${trimmedPrompt}".`;
    addAIHistoryEntry('assistant', fallbackAnswer);
  }
}

function initAIChat() {
  aiSendBtn.addEventListener('click', () => sendPrompt(aiInput.value));
  aiInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') sendPrompt(aiInput.value);
  });
  newChatBtn.addEventListener('click', () => {
    conversation = [];
    saveAIHistory();
    renderAIChat();
  });
  renderAIChat();
}

export { initAIChat, addAIHistoryEntry };
