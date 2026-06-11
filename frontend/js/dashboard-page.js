import { initCommon, getStoredUser } from './common.js';
import { loadGameState } from './games.js';

let dashboardInitialized = false;

function initDashboardPage() {
  initCommon();
  const greeting = document.querySelector('.dashboard-greeting');
  if (greeting) {
    greeting.textContent = `Welcome back, ${getStoredUser().name}!`;
  }
  loadGameState();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!dashboardInitialized) {
    initDashboardPage();
    dashboardInitialized = true;
  }
});

window.addEventListener('pageChanged', event => {
  if (event.detail.page === 'dashboard' && !dashboardInitialized) {
    initDashboardPage();
    dashboardInitialized = true;
  }
});
