const gamePanel = document.getElementById('gameContent');
const gamesHighScore = document.getElementById('gamesHighScore');
const recentActivityList = document.getElementById('recentActivityList');

const state = {
  score: 0,
  history: []
};

function loadGameState() {
  const stored = JSON.parse(localStorage.getItem('pukGameState') || '{}');
  state.score = stored.highScore || 0;
  state.history = stored.activity || [];
  gamesHighScore.textContent = state.score;
  renderRecentActivity();
}

function saveGameState() {
  localStorage.setItem('pukGameState', JSON.stringify({
    highScore: state.score,
    activity: state.history.slice(-5)
  }));
}

function renderRecentActivity() {
  recentActivityList.innerHTML = '';
  if (!state.history.length) {
    recentActivityList.innerHTML = '<li>No activity yet. Launch a tool to begin.</li>';
    return;
  }
  state.history.slice().reverse().forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    recentActivityList.appendChild(li);
  });
}

function addActivity(entry) {
  state.history.push(`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${entry}`);
  if (state.history.length > 8) state.history.shift();
  renderRecentActivity();
  saveGameState();
}

function updateScore(value) {
  if (value > state.score) {
    state.score = value;
    gamesHighScore.textContent = state.score;
  }
  saveGameState();
}

function mountGame(gameId) {
  if (gameId === 'rps') {
    loadRPS();
  } else if (gameId === 'tictactoe') {
    loadTicTacToe();
  } else if (gameId === 'guessing') {
    loadNumberGuess();
  }
}

function loadRPS() {
  const choices = ['Rock', 'Paper', 'Scissors'];
  let streak = 0;
  gamePanel.innerHTML = `
    <div class="mini-header"><h3>Rock Paper Scissors</h3><p>Score a streak by beating the bot.</p></div>
    <div class="rps-grid">
      ${choices.map(choice => `<button class="secondary-btn rps-btn" data-choice="${choice}">${choice}</button>`).join('')}
    </div>
    <div class="game-result" id="rpsResult">Choose your move.</div>
  `;

  const resultBox = document.getElementById('rpsResult');
  gamePanel.querySelectorAll('.rps-btn').forEach(button => {
    button.addEventListener('click', () => {
      const userChoice = button.dataset.choice;
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      const outcome = determineRPS(userChoice, botChoice);
      if (outcome === 'win') {
        streak += 1;
        updateScore(streak);
      } else if (outcome === 'lose') {
        streak = 0;
      }
      resultBox.textContent = `You chose ${userChoice}, the bot chose ${botChoice}. ${outcome === 'win' ? 'You win!' : outcome === 'lose' ? 'You lose.' : 'Draw.'}`;
      addActivity(`RPS: ${userChoice} vs ${botChoice} (${outcome})`);
    });
  });
}

function determineRPS(user, bot) {
  if (user === bot) return 'draw';
  const wins = { Rock: 'Scissors', Paper: 'Rock', Scissors: 'Paper' };
  return wins[user] === bot ? 'win' : 'lose';
}

function loadTicTacToe() {
  let turn = 'X';
  const board = Array(9).fill(null);
  gamePanel.innerHTML = `
    <div class="mini-header"><h3>Tic Tac Toe</h3><p>Play against yourself and track progress.</p></div>
    <div class="tic-grid" id="ticGrid">${board.map((_, index) => `<button class="tic-cell" data-index="${index}"></button>`).join('')}</div>
    <div class="game-result" id="ticResult">Turn: X</div>
  `;

  const resultBox = document.getElementById('ticResult');
  const cells = gamePanel.querySelectorAll('.tic-cell');
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = Number(cell.dataset.index);
      if (board[idx] || checkWinner(board)) return;
      board[idx] = turn;
      cell.textContent = turn;
      const winner = checkWinner(board);
      if (winner) {
        resultBox.textContent = `${winner} wins!`;
        addActivity(`Tic Tac Toe: ${winner} victory`);
        updateScore(1);
      } else if (board.every(Boolean)) {
        resultBox.textContent = `It's a tie.`;
        addActivity('Tic Tac Toe: draw');
      } else {
        turn = turn === 'X' ? 'O' : 'X';
        resultBox.textContent = `Turn: ${turn}`;
      }
    });
  });
}

function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function loadNumberGuess() {
  const target = Math.floor(Math.random() * 50 + 1);
  let attempts = 0;
  gamePanel.innerHTML = `
    <div class="mini-header"><h3>Number Guessing</h3><p>Guess a number between 1 and 50.</p></div>
    <div class="guess-row">
      <input id="guessInput" type="number" placeholder="Enter guess" min="1" max="50" />
      <button class="primary-btn" id="guessBtn">Guess</button>
    </div>
    <div class="game-result" id="guessResult">Good luck!</div>
  `;

  const guessBtn = document.getElementById('guessBtn');
  const resultBox = document.getElementById('guessResult');
  const guessInput = document.getElementById('guessInput');

  guessBtn.addEventListener('click', () => {
    const guess = Number(guessInput.value);
    if (!guess || guess < 1 || guess > 50) {
      resultBox.textContent = 'Enter a valid number between 1 and 50.';
      return;
    }
    attempts += 1;
    if (guess === target) {
      resultBox.textContent = `Correct! You guessed it in ${attempts} attempts.`;
      updateScore(Math.max(1, 10 - attempts));
      addActivity(`Number guess success in ${attempts} tries`);
    } else if (guess < target) {
      resultBox.textContent = 'Too low. Try again.';
    } else {
      resultBox.textContent = 'Too high. Try again.';
    }
  });
}

function initGameNavigation() {
  document.querySelectorAll('.game-card button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.game-card');
      mountGame(card.dataset.game);
    });
  });

  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => mountGame(card.dataset.game));
  });
}

export { loadGameState, initGameNavigation, addActivity };
