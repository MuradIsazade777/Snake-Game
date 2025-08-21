const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; 
let score = 0;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

let direction = "";

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if(event.key === "ArrowLeft" && direction != "RIGHT") direction = "LEFT";
    if(event.key === "ArrowUp" && direction != "DOWN") direction = "UP";
    if(event.key === "ArrowRight" && direction != "LEFT") direction = "RIGHT";
    if(event.key === "ArrowDown" && direction != "UP") direction = "DOWN";
}

function draw() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "lime" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

   
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction === "LEFT") snakeX -= box;
    if(direction === "UP") snakeY -= box;
    if(direction === "RIGHT") snakeX += box;
    if(direction === "DOWN") snakeY += box;

    if(snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("Game Over! Score: " + score);
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

let game = setInterval(draw, 100);
