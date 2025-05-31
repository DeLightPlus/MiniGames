// Game constants
const GRID_SIZE = 20;
const GRID_COUNT = 20;
const GAME_SPEED = 150;

// Game variables
let snake = [
    { x: 10, y: 10 }
];
let food = {};
let direction = 'right';
let score = 0;
let gameLoop = null;

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score');

// Initialize food position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * GRID_COUNT),
        y: Math.floor(Math.random() * GRID_COUNT)
    };
    
    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.some(segment => 
        segment.x === food.x && segment.y === food.y
    );
    if (isOnSnake) generateFood();
}

// Draw single grid cell
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
        x * GRID_SIZE,
        y * GRID_SIZE,
        GRID_SIZE - 1,
        GRID_SIZE - 1
    );
}

// Draw game state
function draw() {
    // Clear canvas
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        const color = index === 0 ? '#2ecc71' : '#27ae60';
        drawCell(segment.x, segment.y, color);
    });
    
    // Draw food
    drawCell(food.x, food.y, '#e74c3c');
}

// Update snake position
function update() {
    const head = { ...snake[0] };
    
    // Update head position based on direction
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Check for collisions
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

// Check for collisions
function isCollision(position) {
    // Wall collision
    if (position.x < 0 || position.x >= GRID_COUNT ||
        position.y < 0 || position.y >= GRID_COUNT) {
        return true;
    }
    
    // Self collision
    return snake.some(segment =>
        segment.x === position.x && segment.y === position.y
    );
}

// Game over function
function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;
    startBtn.textContent = '↻';
    alert(`Game Over! Score: ${score}`);
}

// Start game function
function drawCountdown(count) {
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2ecc71';
    ctx.font = '64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(count, canvas.width / 2, canvas.height / 2);
}

function startGame() {
    if (gameLoop) return;
    
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    
    // Start countdown
    let count = 3;
    startBtn.disabled = true;
    startBtn.textContent = '⏳';
    
    const countdownInterval = setInterval(() => {
        drawCountdown(count);
        count--;
        
        if (count < 0) {
            clearInterval(countdownInterval);
            startBtn.textContent = '↺';
            startBtn.disabled = false;
            
            // Start game loop
            gameLoop = setInterval(() => {
                update();
                draw();
            }, GAME_SPEED);
        }
    }, 1000);
}

// Responsive canvas sizing
function resizeSnakeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    // Use the smaller of viewport width or height, minus some margin
    const size = Math.min(window.innerWidth, window.innerHeight * 0.7, 480); // 480 is max size
    canvas.width = size;
    canvas.height = size;
}
window.addEventListener('resize', resizeSnakeCanvas);
window.addEventListener('DOMContentLoaded', resizeSnakeCanvas);

// Event listeners
startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

document.getElementById('upBtn')?.addEventListener('click', () => {
    if (direction !== 'down') direction = 'up';
});
document.getElementById('downBtn')?.addEventListener('click', () => {
    if (direction !== 'up') direction = 'down';
});
document.getElementById('leftBtn')?.addEventListener('click', () => {
    if (direction !== 'right') direction = 'left';
});
document.getElementById('rightBtn')?.addEventListener('click', () => {
    if (direction !== 'left') direction = 'right';
});