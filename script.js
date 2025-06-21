const symbols = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍍', '🥝', '🍑'];
let cards, flippedCards, moves, matchedPairs, timeLeft, timer;
const maxMoves = 30;
const maxTime = 60;

const board = document.getElementById('gameBoard');
const movesSpan = document.getElementById('moves');
const timeSpan = document.getElementById('time');
const matchedSpan = document.getElementById('matched');
const pauseBtn = document.getElementById('pause');
const retryBtn = document.getElementById('retry');
const endControls = document.getElementById('end-controls');

let paused = false;

const sounds = {
  match: new Audio('https://www.soundjay.com/button/beep-07.wav'),
  mismatch: new Audio('https://www.soundjay.com/button/beep-10.wav'),
  win: new Audio('https://www.soundjay.com/button/beep-04.wav'),
  lose: new Audio('https://www.soundjay.com/button/beep-05.wav')
};

startGame();

pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
});

retryBtn.addEventListener('click', startGame);

function startGame() {
  clearInterval(timer);
  board.innerHTML = '';
  endControls.innerHTML = '';
  moves = 0;
  matchedPairs = 0;
  timeLeft = maxTime;
  flippedCards = [];
  movesSpan.textContent = moves;
  timeSpan.textContent = timeLeft;
  matchedSpan.textContent = matchedPairs;
  pauseBtn.textContent = 'Pause';
  paused = false;

  cards = shuffle(symbols.concat(symbols));
  cards.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.textContent = '?';
    board.appendChild(card);
  });

  timer = setInterval(() => {
    if (!paused) {
      timeLeft--;
      timeSpan.textContent = timeLeft;
      if (timeLeft <= 0) endGame(false);
    }
  }, 1000);
}

board.addEventListener('click', e => {
  const clicked = e.target;
  if (!clicked.classList.contains('card') || clicked.classList.contains('flipped') || flippedCards.length === 2 || paused) return;

  flipCard(clicked);
  flippedCards.push(clicked);

  if (flippedCards.length === 2) {
    moves++;
    movesSpan.textContent = moves;

    if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
      matchedPairs++;
      matchedSpan.textContent = matchedPairs;
      sounds.match.play();
      flippedCards = [];
      if (matchedPairs === symbols.length) endGame(true);
    } else {
      sounds.mismatch.play();
      setTimeout(() => {
        unflipCard(flippedCards[0]);
        unflipCard(flippedCards[1]);
        flippedCards = [];
      }, 300);
    }

    if (moves > maxMoves) endGame(false);
  }
});

function flipCard(card) {
  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;
}

function unflipCard(card) {
  card.classList.remove('flipped');
  card.textContent = '?';
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function endGame(win) {
  clearInterval(timer);
  board.style.pointerEvents = 'none';
  
  const msg = document.createElement('div');
  msg.textContent = win ? '🎉 You won the game!' : '💥 You lost the game!';
  msg.style.color = win ? '#2ecc71' : '#e74c3c';
  endControls.appendChild(msg);

  if (win) {
    sounds.win.play();
  } else {
    sounds.lose.play();
  }

  const btn = document.createElement('button');
  btn.textContent = win ? 'Replay' : 'Restart';
  btn.addEventListener('click', () => {
    board.style.pointerEvents = 'auto';
    startGame();
  });
  endControls.appendChild(btn);
}
