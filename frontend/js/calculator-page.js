import { initCommon } from './common.js';
import { setupCalculator } from './calculator.js';

let calcInitialized = false;

function initCalcPage() {
  initCommon();
  setupCalculator();

  const assistBtn = document.getElementById('aiAssistBtn');
  const assistPanel = document.getElementById('aiAssistPanel');
  const calcScreen = document.getElementById('calcScreen');

  function explainExpression(expr) {
    if (!expr || expr === '0') {
      return 'Use the calculator to build an expression, then ask AI Assist for a guided explanation.';
    }
    if (expr.includes('+')) {
      return `Add the values in ${expr} and follow the order from left to right.`;
    }
    if (expr.includes('-')) {
      return `Subtract each value from left to right in ${expr} to find the final result.`;
    }
    if (expr.includes('*')) {
      return `Multiply the terms in ${expr} to calculate the final product.`;
    }
    if (expr.includes('/')) {
      return `Divide the first number by the second number in ${expr} to produce the quotient.`;
    }
    if (expr.includes('%')) {
      return `Percent expressions use the percent operator to compute a fraction of the given value.`;
    }
    return `This expression is ready to solve. Press "=" when you are ready.`;
  }

  assistBtn?.addEventListener('click', () => {
    if (!assistPanel || !calcScreen) return;
    assistPanel.textContent = explainExpression(calcScreen.textContent.trim());
    assistPanel.classList.add('glow-panel');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!calcInitialized) {
    initCalcPage();
    calcInitialized = true;
  }
});

window.addEventListener('pageChanged', event => {
  if (event.detail.page === 'calculator' && !calcInitialized) {
    initCalcPage();
    calcInitialized = true;
  }
});
