import { initCommon } from './common.js';

// Initialize games page when it becomes active
window.addEventListener('pageChanged', event => {
  if (event.detail.page === 'games') {
    initGameNavigation();
  }
});
import { loadGameState, initGameNavigation } from './games.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  loadGameState();
  initGameNavigation();
});
