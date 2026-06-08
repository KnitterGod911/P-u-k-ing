import { initCommon } from './common.js';

const themeSummary = document.getElementById('themeSummary');

function updateThemeSummary() {
  if (!themeSummary) return;
  themeSummary.textContent = localStorage.getItem('pukTheme') || 'dark';
}

document.addEventListener('DOMContentLoaded', () => {
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
});
