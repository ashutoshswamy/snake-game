const DEFAULT_SIZE = 20;
const TICK_MS = 140;

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createInitialState(size, rng = Math.random) {
  const center = Math.floor(size / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
  const food = placeFood(size, snake, rng);
  return {
    size,
    snake,
    direction: DIRECTIONS.right,
    queuedDirection: DIRECTIONS.right,
    food,
    score: 0,
    isOver: false,
    isPaused: true,
  };
}

export function placeFood(size, snake, rng = Math.random) {
  const occupied = new Set(snake.map((seg) => `${seg.x},${seg.y}`));
  const empty = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return null;
  const idx = Math.floor(rng() * empty.length);
  return empty[idx];
}

export function stepGame(state, rng = Math.random) {
  if (state.isOver || state.isPaused) return state;

  const nextDir = state.queuedDirection;
  const head = state.snake[0];
  const nextHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

  if (
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= state.size ||
    nextHead.y >= state.size
  ) {
    return { ...state, isOver: true, isPaused: true };
  }

  const body = state.snake.slice(0, -1);
  if (body.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y)) {
    return { ...state, isOver: true, isPaused: true };
  }

  const ateFood =
    state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;

  const nextSnake = [nextHead, ...state.snake];
  if (!ateFood) nextSnake.pop();

  const nextFood = ateFood ? placeFood(state.size, nextSnake, rng) : state.food;

  return {
    ...state,
    snake: nextSnake,
    direction: nextDir,
    food: nextFood,
    score: ateFood ? state.score + 1 : state.score,
  };
}

export function queueDirection(state, dir) {
  const current = state.direction;
  const isOpposite = current.x + dir.x === 0 && current.y + dir.y === 0;
  if (isOpposite) return state;
  return { ...state, queuedDirection: dir };
}

function createBoard(size) {
  const board = document.getElementById("board");
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  board.innerHTML = "";
  const cells = [];
  for (let i = 0; i < size * size; i += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
    cells.push(cell);
  }
  return cells;
}

function render(state, cells) {
  cells.forEach((cell) => {
    cell.className = "cell";
  });

  for (const seg of state.snake) {
    const idx = seg.y * state.size + seg.x;
    if (cells[idx]) cells[idx].classList.add("snake");
  }

  if (state.food) {
    const foodIdx = state.food.y * state.size + state.food.x;
    if (cells[foodIdx]) cells[foodIdx].classList.add("food");
  }

  document.getElementById("score").textContent = String(state.score);
  const status = document.getElementById("status");
  if (state.isOver) status.textContent = "Game over. Press Enter or Restart.";
  else if (state.isPaused) status.textContent = "Paused. Press Space or Start.";
  else status.textContent = "Running";
}

let game = createInitialState(DEFAULT_SIZE);
const cells = createBoard(DEFAULT_SIZE);
render(game, cells);

function tick() {
  game = stepGame(game);
  render(game, cells);
}

let timer = null;
function startLoop() {
  if (timer) return;
  timer = setInterval(tick, TICK_MS);
}

function stopLoop() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

function togglePause() {
  game = { ...game, isPaused: !game.isPaused };
  render(game, cells);
}

function restart() {
  game = createInitialState(DEFAULT_SIZE);
  render(game, cells);
}

startLoop();

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

startBtn.addEventListener("click", () => {
  if (game.isOver) restart();
  if (game.isPaused) togglePause();
});

restartBtn.addEventListener("click", () => {
  restart();
});

const dirFromKey = (key) => {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return DIRECTIONS.up;
    case "ArrowDown":
    case "s":
    case "S":
      return DIRECTIONS.down;
    case "ArrowLeft":
    case "a":
    case "A":
      return DIRECTIONS.left;
    case "ArrowRight":
    case "d":
    case "D":
      return DIRECTIONS.right;
    default:
      return null;
  }
};

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    togglePause();
    return;
  }
  if (event.key === "Enter") {
    if (game.isOver) restart();
    return;
  }
  const dir = dirFromKey(event.key);
  if (!dir) return;
  game = queueDirection(game, dir);
});

document.querySelectorAll("[data-dir]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dirName = btn.getAttribute("data-dir");
    if (!dirName || !DIRECTIONS[dirName]) return;
    game = queueDirection(game, DIRECTIONS[dirName]);
    if (game.isPaused && !game.isOver) togglePause();
  });
});

window.addEventListener("blur", () => {
  if (!game.isPaused && !game.isOver) togglePause();
});
