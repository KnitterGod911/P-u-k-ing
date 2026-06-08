const themeLink = document.getElementById('themeStylesheet');
const themeButtons = Array.from(document.querySelectorAll('.toggle-option'));

const themes = {
  dark: 'css/themes/dark.css',
  light: 'css/themes/light.css',
  neon: 'css/themes/neon.css'
};

function setActiveThemeButton(theme) {
  themeButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.theme === theme);
  });
}

function applyTheme(theme) {
  const selectedTheme = themes[theme] ? theme : 'dark';
  if (themeLink) {
    themeLink.href = themes[selectedTheme];
  }
  localStorage.setItem('pukTheme', selectedTheme);
  document.documentElement.dataset.theme = selectedTheme;
  setActiveThemeButton(selectedTheme);
  const themeSummary = document.getElementById('themeSummary');
  if (themeSummary) {
    themeSummary.textContent = selectedTheme;
  }
}

function loadTheme() {
  const stored = localStorage.getItem('pukTheme') || 'dark';
  applyTheme(stored);
  return stored;
}

function initThemeSelection() {
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.theme);
    });
  });
}

export { loadTheme, applyTheme, initThemeSelection };
