import { initAuthListeners, logoutUser, openAuthModal, wireAuthEvents, updateUserProfile } from './auth.js';
import { loadGameState, initGameNavigation, addActivity } from './games.js';
import { setupCalculator } from './calculator.js';
import { initAIChat } from './ai.js';
import { initGroupChat, connectChatActivity } from './chat.js';
import { updateProfileDisplay } from './profile.js';
import { initSettings } from './settings.js';
import { loadTheme, initThemeSelection } from './theme.js';

const pageButtons = document.querySelectorAll('.nav-link, .hero-actions button');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const signOutBtn = document.getElementById('signOutBtn');
const customNameInput = document.getElementById('customNameInput');
const customBioInput = document.getElementById('customBioInput');

let currentUser = null;

function setActivePage(pageId) {
  pages.forEach(page => page.id === pageId ? page.classList.add('page-active') : page.classList.remove('page-active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === pageId));
  pageTitle.textContent = pageId.charAt(0).toUpperCase() + pageId.slice(1);
  if (pageId === 'chat') {
    connectChatActivity();
  }
}

function handleNavigation(event) {
  const pageId = event.target.dataset.page;
  if (!pageId) return;
  if (['profile', 'chat', 'settings'].includes(pageId) && !currentUser) {
    openAuthModal();
    return;
  }
  setActivePage(pageId);
}

function applyUserProfile(user) {
  currentUser = user;
  const stats = {
    gamesPlayed: localStorage.getItem('pukGamesPlayed') || '0',
    messagesSent: localStorage.getItem('pukMessagesSent') || '0',
    promptsSent: localStorage.getItem('pukAIAssists') || '0'
  };
  updateProfileDisplay(user, stats);
}

function handleSaveProfile() {
  const name = customNameInput.value.trim();
  const bio = customBioInput.value.trim();
  if ((!name && !bio) || !currentUser) return;
  updateUserProfile(currentUser, { displayName: name || undefined, bio: bio || undefined });
}

function initPageNav() {
  pageButtons.forEach(button => button.addEventListener('click', handleNavigation));
  menuToggle.addEventListener('click', () => sidebar.classList.toggle('sidebar-open'));
  signOutBtn.addEventListener('click', () => logoutUser());
  initSettings(handleSaveProfile);
}

function initPageLinks() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      setActivePage(link.dataset.page);
    });
  });
}

function initRoot() {
  loadTheme();
  initPageNav();
  initPageLinks();
  initThemeSelection();
  wireAuthEvents();
  loadGameState();
  initGameNavigation();
  setupCalculator();
  initAIChat();
  initGroupChat();
  initAuthListeners(applyUserProfile);
  setActivePage('dashboard');
}

window.addEventListener('DOMContentLoaded', initRoot);

export { addActivity };
