const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;

let snake = [];
let food = {};
let direction = "";
let score = 0;
let highScore = 0;
let level = 1;
let game = null;
let isPaused = false;
let gameStarted = false;
let speed = 150;

const difficulties = {
    easy: 150,
    medium: 100,
    hard: 60
};

function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "";
    score = 0;
    level = 1;
    isPaused = false;
    gameStarted = false;
    updateScore();
    generateFood();
    draw();
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
    
    for(let segment of snake) {
        if(food.x === segment.x && food.y === segment.y) {
            generateFood();
            return;
        }
    }
}

function drawSnake() {
    for(let i = 0; i < snake.length; i++) {
        const gradient = ctx.createLinearGradient(
            snake[i].x, snake[i].y, 
            snake[i].x + box, snake[i].y + box
        );
        
        if(i === 0) {
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, '#00cc66');
        } else {
            gradient.addColorStop(0, '#44ff99');
            gradient.addColorStop(1, '#22dd77');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(snake[i].x, snake[i].y, box - 2, box - 2);
        
        if(i === 0) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(snake[i].x + 6, snake[i].y + 8, 2, 0, Math.PI * 2);
            ctx.arc(snake[i].x + 14, snake[i].y + 8, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawFood() {
    const gradient = ctx.createRadialGradient(
        food.x + box/2, food.y + box/2, 2,
        food.x + box/2, food.y + box/2, box/2
    );
    gradient.addColorStop(0, '#ff4444');
    gradient.addColorStop(1, '#cc0000');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(food.x + box/2 - 2, food.y + 2, 2, 4);
}

function draw() {
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();

    if(!gameStarted) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Press START to begin", canvas.width/2, canvas.height/2);
        return;
    }

    if(isPaused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width/2, canvas.height/2);
        return;
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction === "LEFT") snakeX -= box;
    if(direction === "UP") snakeY -= box;
    if(direction === "RIGHT") snakeX += box;
    if(direction === "DOWN") snakeY += box;

    if(snakeX === food.x && snakeY === food.y) {
        score++;
        level = Math.floor(score / 5) + 1;
        updateScore();
        generateFood();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    
    if(score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = highScore;
    }
}

function gameOver() {
    clearInterval(game);
    gameStarted = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalHighScore').textContent = highScore;
    document.getElementById('gameOverOverlay').style.display = 'flex';
}

function restartGame() {
    document.getElementById('gameOverOverlay').style.display = 'none';
    initGame();
    startGame();
}

function startGame() {
    if(gameStarted) return;
    
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    speed = difficulties[selectedDifficulty];
    
    gameStarted = true;
    isPaused = false;
    
    if(direction === "") {
        direction = "RIGHT";
    }
    
    if(game) clearInterval(game);
    game = setInterval(draw, speed);
}

function pauseGame() {
    if(!gameStarted) return;
    isPaused = !isPaused;
    document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
}

function resetGame() {
    if(game) clearInterval(game);
    initGame();
    document.getElementById('pauseBtn').textContent = 'Pause';
}

document.addEventListener("keydown", (event) => {
    if(!gameStarted && (event.key.startsWith("Arrow") || "wasd".includes(event.key.toLowerCase()))) {
        startGame();
    }

    if(event.key === " ") {
        event.preventDefault();
        pauseGame();
        return;
    }

    if((event.key === "ArrowLeft" || event.key === "a") && direction !== "RIGHT") direction = "LEFT";
    if((event.key === "ArrowUp" || event.key === "w") && direction !== "DOWN") direction = "UP";
    if((event.key === "ArrowRight" || event.key === "d") && direction !== "LEFT") direction = "RIGHT";
    if((event.key === "ArrowDown" || event.key === "s") && direction !== "UP") direction = "DOWN";
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);

document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if(gameStarted) {
            resetGame();
        }
    });
});

initGame();
