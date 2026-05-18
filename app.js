const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const box = 32;
let score = 0;
const rows = 25;
const cols = 25;
canvas.width = cols * box;
canvas.height = rows * box;

let snake;
let d;
let foods;
let game;

// 初始化遊戲
function initGame() {
  snake = [
    { x: 12 * box, y: 12 * box },
    { x: 11 * box, y: 12 * box },
    { x: 10 * box, y: 12 * box }
  ];
  d = "RIGHT";
  score = 0;
  generateFoods(5);
  clearInterval(game);
  game = setInterval(draw, 100);
  document.getElementById("score").innerText = score;
}

function generateFoods(count) {
  foods = [];
  for (let i = 0; i < count; i++) {
    foods.push({
      x: Math.floor(Math.random() * (cols - 1) + 1) * box,
      y: Math.floor(Math.random() * (rows - 1) + 1) * box
    });
  }
}

// 鍵盤控制
document.addEventListener("keydown", direction);
function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
  else if (event.keyCode == 38 && d != "DOWN") d = "UP";
  else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
  else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

// 手機按鈕控制
document.getElementById("btnLeft").addEventListener("click", () => { if (d != "RIGHT") d = "LEFT"; });
document.getElementById("btnUp").addEventListener("click", () => { if (d != "DOWN") d = "UP"; });
document.getElementById("btnRight").addEventListener("click", () => { if (d != "LEFT") d = "RIGHT"; });
document.getElementById("btnDown").addEventListener("click", () => { if (d != "UP") d = "DOWN"; });

// 手指滑動控制
let touchStartX, touchStartY;
canvas.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
canvas.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - touchStartX;
  let dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && d != "LEFT") d = "RIGHT";
    else if (dx < 0 && d != "RIGHT") d = "LEFT";
  } else {
    if (dy > 0 && d != "UP") d = "DOWN";
    else if (dy < 0 && d != "DOWN") d = "UP";
  }
});

// 繪製遊戲
function draw() {
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

  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i == 0 ? "darkgreen" : "green";
    context.fillRect(snake[i].x, snake[i].y, box, box);
    context.strokeStyle = "white";
    context.strokeRect(snake[i].x, snake[i].y, box, box);
  }

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

  if (!ateFood) snake.pop();

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= cols * box ||
    snakeY >= rows * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText("遊戲結束！請按重新開始", box * 3, box * 12);
    return;
  }

  snake.unshift(newHead);
  document.getElementById("score").innerText = score;
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) return true;
  }
  return false;
}

// 綁定重新開始按鈕
document.getElementById("restart").addEventListener("click", initGame);

// 啟動遊戲
initGame();

