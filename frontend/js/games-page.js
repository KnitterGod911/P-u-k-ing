import { initCommon } from './common.js';
import { loadGameState, initGameNavigation } from './games.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  loadGameState();
  initGameNavigation();
});
