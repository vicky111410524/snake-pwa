const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const box = 32;
let score = 0;

// 把遊戲區域放大 (20x20 格 → 25x25 格)
const rows = 25;
const cols = 25;
canvas.width = cols * box;
canvas.height = rows * box;

// 初始蛇（三格長度）
let snake = [
  { x: 12 * box, y: 12 * box },
  { x: 11 * box, y: 12 * box },
  { x: 10 * box, y: 12 * box }
];

// 多顆食物
let foods = [];
function generateFoods(count) {
  foods = [];
  for (let i = 0; i < count; i++) {
    foods.push({
      x: Math.floor(Math.random() * (cols - 1) + 1) * box,
      y: Math.floor(Math.random() * (rows - 1) + 1) * box
    });
  }
}
generateFoods(5); // 一開始生成 5 顆豆子

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
  // 美化背景：淺色格線
  context.fillStyle = "#f0f0f0";
  context.fillRect(0, 0, cols * box, rows * box);

  context.strokeStyle = "#ddd";
  for (let i = 0; i < cols; i++) {
    context.beginPath();
    context.moveTo(i * box, 0);
    context.lineTo(i * box, rows * box);
    context.stroke();
  }
  for (let j = 0; j < rows; j++) {
    context.beginPath();
    context.moveTo(0, j * box);
    context.lineTo(cols * box, j * box);
    context.stroke();
  }

  // 畫蛇
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i == 0 ? "darkgreen" : "green";
    context.fillRect(snake[i].x, snake[i].y, box, box);
    context.strokeStyle = "white";
    context.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // 畫食物
  for (let f of foods) {
    context.fillStyle = "red";
    context.fillRect(f.x, f.y, box, box);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // 檢查是否吃到食物
  let ateFood = false;
  for (let i = 0; i < foods.length; i++) {
    if (snakeX == foods[i].x && snakeY == foods[i].y) {
      score++;
      ateFood = true;
      foods.splice(i, 1);
      foods.push({
        x: Math.floor(Math.random() * (cols - 1) + 1) * box,
        y: Math.floor(Math.random() * (rows - 1) + 1) * box
      });
      break;
    }
  }

  if (!ateFood) {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // 撞牆或撞到自己 → 遊戲結束
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= cols * box ||
    snakeY >= rows * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
  }

  snake.unshift(newHead);

  context.fillStyle = "black";
  context.font = "20px Arial";
  context.fillText("分數：" + score, box, box);
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
