import { initCommon } from './common.js';

let settingsInitialized = false;

function updateThemeSummary() {
  const themeSummary = document.getElementById('themeSummary');
  if (!themeSummary) return;
  themeSummary.textContent = localStorage.getItem('pukTheme') || 'dark';
}

function initSettingsPage() {
  initCommon();
  const animationToggle = document.getElementById('animationsToggle');

  if (animationToggle) {
    animationToggle.checked = localStorage.getItem('pukAnimationsEnabled') !== 'false';
    animationToggle.addEventListener('change', event => {
      localStorage.setItem('pukAnimationsEnabled', event.target.checked ? 'true' : 'false');
      document.documentElement.dataset.animations = event.target.checked ? 'on' : 'off';
    });
  }

  updateThemeSummary();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!settingsInitialized) {
    initSettingsPage();
    settingsInitialized = true;
  }
});

window.addEventListener('pageChanged', event => {
  if (event.detail.page === 'settings' && !settingsInitialized) {
    initSettingsPage();
    settingsInitialized = true;
  }
});
