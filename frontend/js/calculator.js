const calcScreen = document.getElementById('calcScreen');
const buttons = Array.from(document.querySelectorAll('.calc-btn, .operation-btn'));
let currentValue = '0';
let previousValue = null;
let operator = null;
let overwrite = false;

function formatDisplay(value) {
  return value.toString();
}

function updateDisplay() {
  calcScreen.textContent = formatDisplay(currentValue);
}

function clearCalculator() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  overwrite = false;
  updateDisplay();
}

function deleteDigit() {
  if (overwrite) {
    currentValue = '0';
    overwrite = false;
    return;
  }
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
}

function appendNumber(number) {
  if (overwrite) {
    currentValue = '0';
    overwrite = false;
  }
  if (number === '.' && currentValue.includes('.')) return;
  currentValue = currentValue === '0' && number !== '.' ? number : currentValue + number;
}

function chooseOperator(selectedOperator) {
  if (currentValue === '') return;
  if (previousValue !== null) {
    compute();
  }
  operator = selectedOperator;
  previousValue = currentValue;
  overwrite = true;
}

function compute() {
  let computation;
  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  if (isNaN(prev) || isNaN(current)) return;
  switch (operator) {
    case '+': computation = prev + current; break;
    case '-': computation = prev - current; break;
    case '*': computation = prev * current; break;
    case '/': computation = current === 0 ? 'Error' : prev / current; break;
    case '%': computation = (prev * current) / 100; break;
    default: return;
  }
  currentValue = computation.toString();
  operator = null;
  previousValue = null;
  overwrite = true;
}

function handleCalculatorInput(value) {
  if (value === 'clear') {
    clearCalculator();
    return;
  }
  if (value === 'delete') {
    deleteDigit();
    updateDisplay();
    return;
  }
  if (['+', '-', '*', '/', '%'].includes(value)) {
    chooseOperator(value);
    return;
  }
  if (value === '=') {
    compute();
    updateDisplay();
    return;
  }
  appendNumber(value);
  updateDisplay();
}

function setupCalculator() {
  buttons.forEach(button => {
    button.addEventListener('click', () => handleCalculatorInput(button.dataset.value));
  });

  window.addEventListener('keydown', event => {
    const key = event.key;
    if (/^\d$/.test(key) || key === '.') {
      handleCalculatorInput(key);
      return;
    }
    if (['+', '-', '*', '/', '%'].includes(key)) {
      handleCalculatorInput(key);
      return;
    }
    if (key === 'Enter' || key === '=') {
      handleCalculatorInput('=');
      return;
    }
    if (key === 'Backspace') {
      handleCalculatorInput('delete');
      return;
    }
    if (key === 'Escape') {
      handleCalculatorInput('clear');
    }
  });
}

export { setupCalculator };
