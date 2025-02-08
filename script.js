// Select the canvas and set up the context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 5,
  dx: 0,
  dy: 0,
  tail: [],
  length: 5,
};

let food = {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: 10,
};

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

// Update the game state
function update() {
  // Move the player
  player.x += player.dx;
  player.y += player.dy;

  // Wrap around the screen edges
  if (player.x < 0) player.x = canvas.width;
  if (player.x > canvas.width) player.x = 0;
  if (player.y < 0) player.y = canvas.height;
  if (player.y > canvas.height) player.y = 0;

  // Add the current position to the tail
  player.tail.push({ x: player.x, y: player.y });

  // Keep the tail length consistent
  if (player.tail.length > player.length) {
    player.tail.shift();
  }

  // Check for collision with food
  if (
    player.x < food.x + food.size &&
    player.x + player.size > food.x &&
    player.y < food.y + food.size &&
    player.y + player.size > food.y
  ) {
    player.length++;
    food = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 10,
    };
  }
}

// Draw everything on the canvas
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player's tail
  ctx.fillStyle = 'lime';
  player.tail.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, player.size, player.size);
  });

  // Draw the food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, food.size, food.size);
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();