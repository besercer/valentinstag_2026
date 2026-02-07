/* ============================================================
   app.js – Landing Page Logik, Nein-Button-Flucht, Sparkles
   ============================================================ */

// ===== Nein-Button: Fluchtmechanismus =====
// Der Button bekommt bei jedem Hover/Touch eine neue zufällige Position,
// sodass er nie geklickt werden kann.

const btnNein = document.getElementById('btn-nein');
const neinComment = document.getElementById('nein-comment');
let neinAttempts = 0;

const neinTexts = [
  'Haha, erwischt! 😜',
  'So einfach wird das nicht! 💅',
  'Netter Versuch! 😏',
  'Du kommst mir nicht aus! 💘',
  'Gibt\'s nicht! 🙅‍♀️',
  'Denkste! 😂',
  'Ich bin schneller! ⚡',
  'Nö nö nö! 🤭',
  'Versuch\'s gar nicht erst! 😘',
  'Sag einfach Ja! 💖',
];

function fleeButton() {
  neinAttempts++;

  // Witzigen Kommentar anzeigen
  neinComment.textContent = neinTexts[neinAttempts % neinTexts.length];

  // Button wird fixed positioniert beim ersten Fluchtversuch
  if (!btnNein.classList.contains('fleeing')) {
    btnNein.classList.add('fleeing');
  }

  // Neue Position berechnen (mit Abstand zum Rand)
  const margin = 20;
  const btnW = btnNein.offsetWidth;
  const btnH = btnNein.offsetHeight;
  const maxX = window.innerWidth - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;

  const newX = margin + Math.random() * (maxX - margin);
  const newY = margin + Math.random() * (maxY - margin);

  btnNein.style.left = newX + 'px';
  btnNein.style.top = newY + 'px';
}

// Desktop: Mouseover genügt, damit der Button flieht BEVOR ein Click möglich ist
btnNein.addEventListener('mouseenter', fleeButton);

// Mobile/Touch: Beim Touch sofort fliehen
btnNein.addEventListener('touchstart', function (e) {
  e.preventDefault(); // Verhindert den Click
  fleeButton();
}, { passive: false });

// Falls doch ein Click durchrutscht: nochmal fliehen
btnNein.addEventListener('click', function (e) {
  e.preventDefault();
  fleeButton();
});


// ===== Ja-Button: Zur Yes-Ansicht wechseln =====

function onYes() {
  document.getElementById('landing').classList.remove('active');
  document.getElementById('yes-screen').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ===== Floating Hearts im Hintergrund =====

const heartsContainer = document.getElementById('floating-hearts');
const heartEmojis = ['💕', '💖', '💗', '💘', '💝', '♥️', '🩷'];

function spawnFloatingHeart() {
  const heart = document.createElement('span');
  heart.classList.add('floating-heart');
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  heart.style.animationDuration = (6 + Math.random() * 6) + 's';
  heart.style.animationDelay = '0s';
  heartsContainer.appendChild(heart);

  // Nach Animation entfernen
  heart.addEventListener('animationend', () => heart.remove());
}

// Maximal 15 gleichzeitig – alle 800ms ein neues Herz
setInterval(() => {
  if (heartsContainer.childElementCount < 15) {
    spawnFloatingHeart();
  }
}, 800);

// Anfangs ein paar spawnen
for (let i = 0; i < 6; i++) {
  setTimeout(spawnFloatingHeart, i * 300);
}


// ===== Sparkle-Partikel (Canvas) =====

const sparkleCanvas = document.getElementById('sparkle-canvas');
const ctx = sparkleCanvas.getContext('2d');
let sparkles = [];

function resizeCanvas() {
  sparkleCanvas.width = window.innerWidth;
  sparkleCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createSparkle() {
  return {
    x: Math.random() * sparkleCanvas.width,
    y: Math.random() * sparkleCanvas.height,
    size: Math.random() * 3 + 1,
    alpha: Math.random(),
    da: (Math.random() - 0.5) * 0.02, // Alpha-Veränderung
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
  };
}

// Initial Sparkles
for (let i = 0; i < 50; i++) {
  sparkles.push(createSparkle());
}

function drawSparkles() {
  ctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
  for (const s of sparkles) {
    s.x += s.dx;
    s.y += s.dy;
    s.alpha += s.da;

    if (s.alpha <= 0 || s.alpha >= 1) s.da = -s.da;
    if (s.x < 0 || s.x > sparkleCanvas.width) s.dx = -s.dx;
    if (s.y < 0 || s.y > sparkleCanvas.height) s.dy = -s.dy;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${Math.max(0, s.alpha) * 0.6})`;
    ctx.fill();
  }
  requestAnimationFrame(drawSparkles);
}
drawSparkles();
