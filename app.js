const WORDS = [
  "apple",
  "galaxy",
  "keyboard",
  "coffee",
  "storm",
  "future",
  "library",
  "victory",
  "quantum",
  "lantern",
  "journey",
  "castle",
  "freedom",
  "diamond",
  "network",
  "sunrise",
  "thunder",
  "velocity",
];

const PHRASES = [
  "keep moving forward",
  "practice makes progress",
  "coding in the rain",
  "focus on the rhythm",
  "never stop learning",
  "beyond the horizon",
  "think before you type",
  "small steps every day",
  "follow your curiosity",
  "hit the right keys",
  "embrace the challenge",
  "storm of words",
];

const scoreEl = document.querySelector("#score");
const levelEl = document.querySelector("#level");
const livesEl = document.querySelector("#lives");
const playfield = document.querySelector("#playfield");
const overlay = document.querySelector("#overlay");
const startBtn = document.querySelector("#startBtn");
const typeForm = document.querySelector("#typeForm");
const typeInput = document.querySelector("#typeInput");
const messageEl = document.querySelector("#message");

let drops = [];
let spawnTimer = 0;
let lastTime = 0;
let gameOver = false;

const state = {
  score: 0,
  level: 1,
  lives: 5,
};

function randomItem() {
  const pool = Math.random() < 0.68 ? WORDS : PHRASES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function spawnDelayByLevel(level) {
  return Math.max(320, 1200 - (level - 1) * 110);
}

function speedByLevel(level) {
  return 50 + (level - 1) * 13;
}

function createDrop() {
  const text = randomItem();
  const element = document.createElement("div");
  element.className = "drop";
  element.textContent = text;
  playfield.appendChild(element);

  const maxX = Math.max(20, playfield.clientWidth - element.offsetWidth - 10);
  const x = 8 + Math.random() * maxX;
  element.style.left = `${x}px`;

  const drop = {
    text,
    y: -40,
    speed: speedByLevel(state.level) * (0.7 + Math.random() * 0.7),
    element,
  };

  drops.push(drop);
}

function updateHud() {
  scoreEl.textContent = state.score;
  levelEl.textContent = state.level;
  livesEl.textContent = state.lives;
}

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("error", isError);
}

function cleanupDrop(drop) {
  drop.element.remove();
}

function removeMatchedDrop(typed) {
  const normalized = typed.trim().toLowerCase();
  if (!normalized) return false;

  const target = drops.find((drop) => drop.text.toLowerCase() === normalized);
  if (!target) return false;

  drops = drops.filter((drop) => drop !== target);
  cleanupDrop(target);

  const points = target.text.includes(" ") ? 30 : 10;
  state.score += points;
  state.level = 1 + Math.floor(state.score / 120);
  updateHud();
  return true;
}

function resetGame() {
  drops.forEach(cleanupDrop);
  drops = [];

  state.score = 0;
  state.level = 1;
  state.lives = 5;
  spawnTimer = 0;
  gameOver = false;
  lastTime = performance.now();

  updateHud();
  setMessage("Go! Keep the screen clear.");
  overlay.classList.add("hidden");
  typeInput.disabled = false;
  typeInput.value = "";
  typeInput.focus();

  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameOver = true;
  typeInput.disabled = true;
  overlay.classList.remove("hidden");
  overlay.querySelector("h1").textContent = "Game Over";
  overlay.querySelector("p").textContent = `Final Score: ${state.score} | Level: ${state.level}`;
  startBtn.textContent = "Play Again";
  setMessage("A drop hit the ground too many times.", true);
}

function gameLoop(timestamp) {
  if (gameOver) return;
  const delta = Math.min(50, timestamp - lastTime);
  lastTime = timestamp;

  spawnTimer += delta;
  if (spawnTimer >= spawnDelayByLevel(state.level)) {
    spawnTimer = 0;
    createDrop();

    if (Math.random() < Math.min(0.18 + state.level * 0.05, 0.58)) {
      createDrop();
    }
  }

  const height = playfield.clientHeight;
  const missed = [];

  for (const drop of drops) {
    drop.y += (drop.speed * delta) / 1000;
    drop.element.style.transform = `translateY(${drop.y}px)`;

    if (drop.y > height) {
      missed.push(drop);
    }
  }

  if (missed.length > 0) {
    for (const drop of missed) {
      drops = drops.filter((item) => item !== drop);
      cleanupDrop(drop);
      state.lives -= 1;
    }
    updateHud();
  }

  if (state.lives <= 0) {
    endGame();
    return;
  }

  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", () => {
  overlay.querySelector("h1").textContent = "Typing Rain";
  overlay.querySelector("p").textContent = "Type the falling English words and phrases, then press Enter.";
  startBtn.textContent = "Start Game";
  resetGame();
});

typeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const typed = typeInput.value;

  if (removeMatchedDrop(typed)) {
    setMessage("Great! Keep typing.");
  } else {
    setMessage(`No match for "${typed.trim()}"`, true);
  }

  typeInput.value = "";
  typeInput.focus();
});

updateHud();
