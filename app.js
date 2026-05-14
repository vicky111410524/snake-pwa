const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
let snake, direction, food, score, game;

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
  score = 0;
  scoreElement.textContent = score;
  if (game) clearInterval(game);
  game = setInterval(draw, 100);
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

restartBtn.addEventListener("click", initGame);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 畫蛇
  snake.forEach(segment => {
    ctx.fillStyle = "lime";
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  // 畫食物
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // 移動蛇
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // 吃到食物
  if (headX === food.x && headY === food.y) {
    score++;
    scoreElement.textContent = score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // 撞牆或撞自己 → 遊戲結束
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
  ) {
    clearInterval(game);
    alert("遊戲結束！分數：" + score);
    return;
  }

  snake.unshift(newHead);
}

// 啟動遊戲
initGame();
