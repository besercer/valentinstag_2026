/* ============================================================
   game.js – Herzchen-Fang-Spiel
   Herzen fallen von oben, der Spieler bewegt ein Körbchen
   mit Maus oder Pfeiltasten und sammelt sie ein.
   3 Leben – bei jedem verpassten Herz verliert man 1 Leben.
   Highscore wird in localStorage gespeichert.
   ============================================================ */

const gameWrapper = document.getElementById('game-wrapper');
const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const livesEl = document.getElementById('lives');
const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScoreEl = document.getElementById('final-score');
const finalHighscoreEl = document.getElementById('final-highscore');

// Spielzustand
let gameRunning = false;
let score = 0;
let lives = 3;
let hearts = [];
let basket = { x: 0, w: 70, h: 50 };
let animationId = null;
let spawnInterval = null;
let difficulty = 1;

// Canvas-Größe
const GAME_W = 600;
const GAME_H = 500;

function resizeGameCanvas() {
  const containerWidth = gameWrapper.clientWidth;
  const scale = Math.min(1, containerWidth / GAME_W);
  gameCanvas.width = GAME_W;
  gameCanvas.height = GAME_H;
  gameCanvas.style.width = (GAME_W * scale) + 'px';
  gameCanvas.style.height = (GAME_H * scale) + 'px';
}

// Highscore aus localStorage laden
function loadHighscore() {
  return parseInt(localStorage.getItem('valentines_highscore') || '0', 10);
}

function saveHighscore(val) {
  localStorage.setItem('valentines_highscore', val.toString());
}

// ===== Spiel starten =====
function startGame() {
  gameWrapper.classList.remove('hidden');
  gameOverOverlay.classList.add('hidden');
  gameWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });

  score = 0;
  lives = 3;
  hearts = [];
  difficulty = 1;
  basket.x = GAME_W / 2 - basket.w / 2;

  scoreEl.textContent = '0';
  livesEl.textContent = '3';
  highscoreEl.textContent = loadHighscore();

  resizeGameCanvas();
  gameRunning = true;

  // Herzen spawnen
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(spawnHeart, 900);

  // Game Loop starten
  if (animationId) cancelAnimationFrame(animationId);
  gameLoop();
}

function restartGame() {
  startGame();
}

// ===== Herz-Objekt erzeugen =====
function spawnHeart() {
  if (!gameRunning) return;

  const size = 28 + Math.random() * 16;
  hearts.push({
    x: Math.random() * (GAME_W - size),
    y: -size,
    size: size,
    speed: 1.5 + Math.random() * 1.5 + difficulty * 0.3,
    emoji: ['💖', '💗', '💕', '💘', '💝'][Math.floor(Math.random() * 5)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.05,
  });

  // Schwierigkeit erhöhen über Zeit
  difficulty += 0.02;
}

// ===== Steuerung =====
let keysDown = {};

document.addEventListener('keydown', (e) => {
  keysDown[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  keysDown[e.key] = false;
});

// Maus-Steuerung auf dem Canvas
gameCanvas.addEventListener('mousemove', (e) => {
  if (!gameRunning) return;
  const rect = gameCanvas.getBoundingClientRect();
  const scaleX = GAME_W / rect.width;
  basket.x = (e.clientX - rect.left) * scaleX - basket.w / 2;
  basket.x = Math.max(0, Math.min(GAME_W - basket.w, basket.x));
});

// Touch-Steuerung
gameCanvas.addEventListener('touchmove', (e) => {
  if (!gameRunning) return;
  e.preventDefault();
  const rect = gameCanvas.getBoundingClientRect();
  const scaleX = GAME_W / rect.width;
  const touch = e.touches[0];
  basket.x = (touch.clientX - rect.left) * scaleX - basket.w / 2;
  basket.x = Math.max(0, Math.min(GAME_W - basket.w, basket.x));
}, { passive: false });

// ===== Game Loop =====
function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function update() {
  // Tastatur-Steuerung
  const speed = 7;
  if (keysDown['ArrowLeft'] || keysDown['a']) basket.x -= speed;
  if (keysDown['ArrowRight'] || keysDown['d']) basket.x += speed;
  basket.x = Math.max(0, Math.min(GAME_W - basket.w, basket.x));

  // Herzen bewegen
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.y += h.speed;
    h.rotation += h.rotSpeed;

    // Kollision mit Körbchen?
    const hCenterX = h.x + h.size / 2;
    const hCenterY = h.y + h.size / 2;
    const basketTop = GAME_H - basket.h - 10;

    if (
      hCenterY >= basketTop &&
      hCenterY <= basketTop + basket.h &&
      hCenterX >= basket.x &&
      hCenterX <= basket.x + basket.w
    ) {
      // Gefangen!
      score++;
      scoreEl.textContent = score;
      hearts.splice(i, 1);
      continue;
    }

    // Aus dem Bildschirm gefallen?
    if (h.y > GAME_H + h.size) {
      hearts.splice(i, 1);
      lives--;
      livesEl.textContent = lives;

      if (lives <= 0) {
        gameOver();
        return;
      }
    }
  }
}

function draw() {
  gameCtx.clearRect(0, 0, GAME_W, GAME_H);

  // Herzen zeichnen
  for (const h of hearts) {
    gameCtx.save();
    gameCtx.translate(h.x + h.size / 2, h.y + h.size / 2);
    gameCtx.rotate(h.rotation);
    gameCtx.font = h.size + 'px serif';
    gameCtx.textAlign = 'center';
    gameCtx.textBaseline = 'middle';
    gameCtx.fillText(h.emoji, 0, 0);
    gameCtx.restore();
  }

  // Körbchen zeichnen
  const bx = basket.x;
  const by = GAME_H - basket.h - 10;

  // Körbchen als Emoji
  gameCtx.font = basket.h + 'px serif';
  gameCtx.textAlign = 'center';
  gameCtx.textBaseline = 'middle';
  gameCtx.fillText('🧺', bx + basket.w / 2, by + basket.h / 2);
}

function gameOver() {
  gameRunning = false;
  if (spawnInterval) clearInterval(spawnInterval);
  if (animationId) cancelAnimationFrame(animationId);

  // Highscore aktualisieren
  let hs = loadHighscore();
  if (score > hs) {
    hs = score;
    saveHighscore(hs);
  }

  finalScoreEl.textContent = score;
  finalHighscoreEl.textContent = hs;
  highscoreEl.textContent = hs;

  gameOverOverlay.classList.remove('hidden');
}

// Canvas-Resize bei Fensteränderung
window.addEventListener('resize', () => {
  if (!gameWrapper.classList.contains('hidden')) {
    resizeGameCanvas();
  }
});
