const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const box = 32;
let score = 0;

// 初始蛇（三格長度）
let snake = [
  { x: 9 * box, y: 10 * box },
  { x: 8 * box, y: 10 * box },
  { x: 7 * box, y: 10 * box }
];

// 食物位置
let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
};

// 控制方向
let d;
document.addEventListener("keydown", direction);

function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
  else if (event.keyCode == 38 && d != "DOWN") d = "UP";
  else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
  else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

// 繪製遊戲
function draw() {
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 19 * box, 19 * box);

  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i == 0 ? "darkgreen" : "green";
    context.fillRect(snake[i].x, snake[i].y, box, box);
    context.strokeStyle = "white";
    context.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  context.fillStyle = "red";
  context.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // 吃到食物 → 蛇長一格
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box
    };
  } else {
    // 沒吃到 → 移除尾巴，保持長度
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // 撞牆或撞到自己 → 遊戲結束
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= 19 * box ||
    snakeY >= 19 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
  }

  snake.unshift(newHead);

  context.fillStyle = "black";
  context.font = "20px Arial";
  context.fillText("Score: " + score, box, box);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

let game = setInterval(draw, 100);

// 啟動遊戲
initGame();
