const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlay-text");
const restartBtn = document.getElementById("restart-btn");

const COLS = 30;
const ROWS = 20;
const CELL = 20;
const START_SPEED = 110;
const MIN_SPEED = 60;

let snake;
let snakeSet;
let dir;
let nextDir;
let food;
let score;
let best;
let gameOver;
let paused;
let speed;
let timer;

function key(x, y) {
  return `${x},${y}`;
}

function randomFood() {
  while (true) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if (!snakeSet.has(key(x, y))) return { x, y };
  }
}

function resetGame() {
  snake = [
    { x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) },
    { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
    { x: Math.floor(COLS / 2) + 1, y: Math.floor(ROWS / 2) },
  ];
  snakeSet = new Set(snake.map((p) => key(p.x, p.y)));
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  food = randomFood();
  score = 0;
  speed = START_SPEED;
  paused = false;
  gameOver = false;
  scoreEl.textContent = score;
  overlay.classList.add("hidden");

  clearTimeout(timer);
  tick();
}

function setDirection(newDir) {
  if (gameOver || paused) return;
  if (newDir.x === -dir.x && newDir.y === -dir.y) return;
  nextDir = newDir;
}

function finishGame() {
  gameOver = true;
  if (score > best) {
    best = score;
    localStorage.setItem("snake_best", String(best));
    bestEl.textContent = best;
  }
  overlayText.textContent = `Game Over - Score: ${score}`;
  overlay.classList.remove("hidden");
}

function tick() {
  if (gameOver || paused) return;

  dir = nextDir;
  const head = snake[snake.length - 1];
  const next = { x: head.x + dir.x, y: head.y + dir.y };

  const hitWall = next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS;
  const tail = snake[0];
  const hitsBody = snakeSet.has(key(next.x, next.y)) && !(next.x === tail.x && next.y === tail.y);

  if (hitWall || hitsBody) {
    draw();
    finishGame();
    return;
  }

  snake.push(next);
  snakeSet.add(key(next.x, next.y));

  if (next.x === food.x && next.y === food.y) {
    score += 1;
    scoreEl.textContent = score;
    speed = Math.max(MIN_SPEED, speed - 2);
    food = randomFood();
  } else {
    const removed = snake.shift();
    snakeSet.delete(key(removed.x, removed.y));
  }

  draw();
  timer = setTimeout(tick, speed);
}

function drawGrid() {
  ctx.strokeStyle = "#e9e2d6";
  ctx.lineWidth = 1;
  for (let x = 1; x < COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL, 0);
    ctx.lineTo(x * CELL, ROWS * CELL);
    ctx.stroke();
  }
  for (let y = 1; y < ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL);
    ctx.lineTo(COLS * CELL, y * CELL);
    ctx.stroke();
  }
}

function drawCell(x, y, color, radius = 4) {
  const px = x * CELL;
  const py = y * CELL;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, radius);
  ctx.fill();
}

function draw() {
  ctx.fillStyle = "#fefdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  drawCell(food.x, food.y, "#d64f3f", 8);

  for (let i = 0; i < snake.length - 1; i++) {
    const p = snake[i];
    drawCell(p.x, p.y, "#1e7b47", 4);
  }

  const head = snake[snake.length - 1];
  drawCell(head.x, head.y, "#125632", 4);
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  if (!paused) {
    overlay.classList.add("hidden");
    tick();
  } else {
    overlayText.textContent = "Paused";
    overlay.classList.remove("hidden");
  }
}

window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();

  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "r", "w", "a", "s", "d"].includes(k) || e.key === " ") {
    e.preventDefault();
  }

  if (k === "arrowup" || k === "w") setDirection({ x: 0, y: -1 });
  if (k === "arrowdown" || k === "s") setDirection({ x: 0, y: 1 });
  if (k === "arrowleft" || k === "a") setDirection({ x: -1, y: 0 });
  if (k === "arrowright" || k === "d") setDirection({ x: 1, y: 0 });
  if (k === "r") resetGame();
  if (e.key === " ") togglePause();
});

restartBtn.addEventListener("click", resetGame);

document.querySelectorAll("[data-dir]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dirName = btn.getAttribute("data-dir");
    if (dirName === "up") setDirection({ x: 0, y: -1 });
    if (dirName === "down") setDirection({ x: 0, y: 1 });
    if (dirName === "left") setDirection({ x: -1, y: 0 });
    if (dirName === "right") setDirection({ x: 1, y: 0 });
  });
});

best = Number(localStorage.getItem("snake_best") || 0);
bestEl.textContent = best;
resetGame();
