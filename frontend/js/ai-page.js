import { initCommon } from './common.js';
import { initAIChat } from './ai.js';

let aiInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  if (!aiInitialized) {
    initAIChat();
    aiInitialized = true;
  }
});

window.addEventListener('pageChanged', event => {
  if (event.detail.page === 'ai' && !aiInitialized) {
    initAIChat();
    aiInitialized = true;
  }
});
