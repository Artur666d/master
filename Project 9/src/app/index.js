const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create ball props
const ball = {
  x: canvas.width - 100,
  y: canvas.height - 100,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};
// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

const brickRowCount = 9;
const brickColumnCount = 10;

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

let score = 0;
let countOfBricks = 0;

// Draw score oon canvas
function drawScore() {
  ctx.font = "20px Arial";
  if(score == 25)
  {
    ctx.fillText(`ИПО лучшие!!!`, canvas.width - 200, 30);
  } else {
    ctx.fillText(`Счет: ${score}`, canvas.width - 750, 30);
    ctx.fillText(`Скорость мяча: ${ball.speed}`, canvas.width - 200, 30);
  }
}

// Update canvas drawing and animation
function update() {
  // Draw everything
  movePaddle();
  moveBall();  
  draw();
  requestAnimationFrame(update);
  increaseBricksCounter();
}
update();

// Draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
  }
  
  // Draw paddle on canvas
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
  }  

  function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawBall();
    drawPaddle();
    drawPaddle();
    drawBricks();
  }
  
  function drawBricks() {
    bricks.forEach(column => {
      column.forEach(brick => {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
        ctx.fill();
        ctx.closePath();
      });
    });
  }

  function movePaddle() {
    paddle.x += paddle.dx;
  
    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
      paddle.x = canvas.width - paddle.w;
    }
  
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
  
  // Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
  
    // Wall collision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1; // ball.dx = ball.dx * -1
    }
  
    // Wall collision (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
      ball.dy *= -1;
    }
  
    // console.log(ball.x, ball.y);
  
    // Paddle collision
    if (
      ball.x - ball.size > paddle.x &&
      ball.x + ball.size < paddle.x + paddle.w &&
      ball.y + ball.size > paddle.y
    ) {
      ball.dy = -ball.speed;
    }
    
    // Brick collision
    bricks.forEach(column => {
      column.forEach(brick => {
        if (brick.visible) {
          if (
            ball.x - ball.size > brick.x && // left brick side check
            ball.x + ball.size < brick.x + brick.w && // right brick side check
            ball.y + ball.size > brick.y && // top brick side check
            ball.y - ball.size < brick.y + brick.h // bottom brick side check
          ) {
            ball.dy *= -1;
            brick.visible = false;
            countOfBricks++;
            increaseScore();
            increaseBricksCounter(countOfBricks);
          }
        }   
      });
    });

    // Hit bottom wall - Lose
    if (ball.y + ball.size > canvas.height) {
      showAllBricks();
      score = 0;
      ball.speed = 4;
    }
  }

  function showAllBricks() {
    bricks.forEach(column => {
      column.forEach(brick => (brick.visible = true));
    });
  }
  
  function increaseScore() {
    score++;         
    if (score % (brickRowCount * brickColumnCount) === 0) {
      showAllBricks();
    }
  }

  function increaseBricksCounter(brosk = 0)
  {
    if(brosk == 10)
    {
      ball.speed++;
      countOfBricks = 0;
    } else if(brosk == 0)
    {
      ball.speed = 4;
    }
  }
    