import { initCommon, getStoredUser } from './common.js';
import { loadGameState } from './games.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  const greeting = document.querySelector('.dashboard-greeting');
  if (greeting) {
    greeting.textContent = `Welcome back, ${getStoredUser().name}!`;
  }
  loadGameState();
});
