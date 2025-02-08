// Select elements
const startScreen = document.getElementById('startScreen');
const playerNameInput = document.getElementById('playerName');
const playButton = document.getElementById('playButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let player = null;
let foods = [];
let aiSnakes = [];
let powerUps = [];
let score = 0;
let playerName = '';

// Initialize game after player enters their name
playButton.addEventListener('click', () => {
  playerName = playerNameInput.value.trim();
  if (playerName) {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    initGame();
  }
});

function initGame() {
  // Initialize player
  player = {
    name: playerName,
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 5,
    dx: 0,
    dy: 0,
    tail: [],
    length: 5,
    color: 'lime',
  };

  // Generate multiple foods
  for (let i = 0; i < 10; i++) {
    foods.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 10,
    });
  }

  // Generate AI-controlled snakes
  for (let i = 0; i < 3; i++) {
    aiSnakes.push({
      name: `AI-${i + 1}`,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 10,
      speed: 3,
      dx: Math.random() > 0.5 ? 3 : -3,
      dy: Math.random() > 0.5 ? 3 : -3,
      tail: [],
      length: 5,
      color: getRandomColor(),
    });
  }

  // Start game loop
  gameLoop();
}

// Helper function to generate random colors
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && player.dy === 0) {
    player.dx = 0;
    player.dy = -player.speed;
  } else if (e.key === 'ArrowDown' && player.dy === 0) {
    player.dx = 0;
    player.dy = player.speed;
  } else if (e.key === 'ArrowLeft' && player.dx === 0) {
    player.dx = -player.speed;
    player.dy = 0;
  } else if (e.key === 'ArrowRight' && player.dx === 0) {
    player.dx = player.speed;
    player.dy = 0;
  }
});

// Update game state
function update() {
  // Update player
  player.x += player.dx;
  player.y += player.dy;
  wrapAround(player);

  // Update AI snakes
  aiSnakes.forEach((snake) => {
    snake.x += snake.dx;
    snake.y += snake.dy;
    wrapAround(snake);
    snake.tail.push({ x: snake.x, y: snake.y });
    if (snake.tail.length > snake.length) snake.tail.shift();
  });

  // Check collisions with food
  foods = foods.filter((food) => {
    if (
      player.x < food.x + food.size &&
      player.x + player.size > food.x &&
      player.y < food.y + food.size &&
      player.y + player.size > food.y
    ) {
      player.length++;
      score++;
      return false; // Remove food
    }
    return true;
  });

  // Add new food if needed
  while (foods.length < 10) {
    foods.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 10,
    });
  }

  // Update player tail
  player.tail.push({ x: player.x, y: player.y });
  if (player.tail.length > player.length) player.tail.shift();
}

// Draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = player.color;
  player.tail.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, player.size, player.size);
  });

  // Draw AI snakes
  aiSnakes.forEach((snake) => {
    ctx.fillStyle = snake.color;
    snake.tail.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, snake.size, snake.size);
    });
  });

  // Draw food
  ctx.fillStyle = 'red';
  foods.forEach((food) => {
    ctx.fillRect(food.x, food.y, food.size, food.size);
  });

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Wrap around screen edges
function wrapAround(entity) {
  if (entity.x < 0) entity.x = canvas.width;
  if (entity.x > canvas.width) entity.x = 0;
  if (entity.y < 0) entity.y = canvas.height;
  if (entity.y > canvas.height) entity.y = 0;
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}