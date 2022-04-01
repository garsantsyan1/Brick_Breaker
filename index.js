const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const backgroundImage = document.createElement("img");
backgroundImage.src = "https://images.wallpaperscraft.ru/image/zvezdnoe_nebo_zvezdy_kosmos_143776_1920x1080.jpg";
const paddle = document.createElement("img");
paddle.src = "https://studio.code.org/v3/assets/2-flDbVz8WWJbxS8deyuUsMcxA_o1Js_x_OVcCEwb8M/BluePaddle.png";

const soundBall = document.createElement("audio");
soundBall.src = "http://www.bndclan.com/Bend3r/Bend3r/hl-content/cstrike/sound/tetris/selection.wav";
const hotlineMiami = document.createElement("audio");
hotlineMiami.src = "https://souts.ru/stream/mym/aHR0cHM6Ly9tb29zaWMubXkubWFpbC5ydS9maWxlLzFmYzdiNGIwMzg4ZTc2ZTFmNzk3OTMyYTZhZWI2NGVhLm1wMw==";

const spring = document.createElement("audio");
spring.src = "https://dight310.byu.edu/media/audio/FreeLoops.com/3/3/Free%20Kick%20Sample%207-897-Free-Loops.com.mp3";

const soundTheAnd = document.createElement("audio");
soundTheAnd.src = "https://api.meowpad.me/v2/sounds/preview/15875.m4a";

const button = document.querySelector("button");

const backgroundCanvas = document.createElement("img");
backgroundCanvas.src = "https://cdn02.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_download_software_1/H2x1_NSwitchDS_BrickBreaker_image1600w.jpg";
context.drawImage(backgroundCanvas, 0, 0, canvas.width, canvas.height);



let data = {
  paddle: {
    xDelta: 0,
    x: 350,
    y: 465,
    width: 120,
    height: 30,
    fillStyle: "orange",
  },

  ball: {
    xDelta: 5,
    yDelta: -5,
    radius: 15,
    x: random(15, canvas.width - 15),
    y: 440,
    fillStyle: "blue",
  },

  boxes: [],
  score: 0,
  lives: 3,

}

function update() {
  if (data.ball.y + data.ball.radius >= canvas.height) {
    data.lives--;
    data.ball.x = random(15, canvas.width - 15);
    data.ball.y = 440;

    data.ball.xDelta = 5;
    data.ball.yDelta = -5;
  }

  data.paddle.x += data.paddle.xDelta;

  if (data.paddle.x < 0) {
    data.paddle.x = 0;
  } else if (data.paddle.x + data.paddle.width > canvas.width) {
    data.paddle.x = canvas.width - data.paddle.width;
  }


  if ((data.ball.x + data.ball.radius) > canvas.width ||
    data.ball.x - data.ball.radius < 0) {
    data.ball.xDelta *= -1;
  }
  if (data.ball.y - data.ball.radius < 0) {
    data.ball.yDelta *= -1;
  }



  if (RectCircleColliding(data.ball, data.paddle)) {
    data.ball.yDelta *= -1;
    spring.currentTime = 0;
    spring.play();
  }


  data.ball.x += data.ball.xDelta;
  data.ball.y += data.ball.yDelta;

}


function drawBoxes() {
  let boxRowCount = 4;
  let boxColumnCount = 8;
  let boxWidth = 75;
  let boxHeight = 30;
  let boxPadding = 20;
  let boxOffsetTop = 40;
  let boxOffsetLeft = 30;

  for (let i = 0; i < boxColumnCount; i++) {
    for (let j = 0; j < boxRowCount; j++) {
      let boxX = (i * (boxWidth + boxPadding)) + boxOffsetLeft;
      let boxY = (j * (boxHeight + boxPadding)) + boxOffsetTop;
      data.boxes.push({
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
        fillStyle: "rgb(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")",
      })
    }
  }
}

drawBoxes();

function changeColor() {
  data.boxes = data.boxes.map(function(box) {
    return {
      ...box,
      fillStyle: "rgb(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")",
    }
  })
}



function RectCircleColliding(circle, rect) {
  let distX = Math.abs(circle.x - rect.x - rect.width / 2);
  let distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > (rect.width / 2 + circle.radius)) {
    return false;
  }
  if (distY > (rect.height / 2 + circle.radius)) {
    return false;
  }

  if (distX <= (rect.width / 2)) {
    return true;
  }
  if (distY <= (rect.height / 2)) {
    return true;
  }

  let dx = distX - rect.width / 2;
  let dy = distY - rect.height / 2;
  return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}


function collisionDetection() {
  data.boxes = data.boxes.filter(function(box) {
    if (RectCircleColliding(data.ball, box)) {
      data.score++;
      soundBall.currentTime = 0;
      soundBall.play();
      data.ball.yDelta *= -1

      return false;
    }

    return true;
  })
}




function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  data.boxes.forEach(function(box) {
    context.fillStyle = box.fillStyle;
    context.fillRect(box.x, box.y, box.width, box.height);
  })

  drawPaddle();
  drawBall();
  collisionDetection();

  changeColor();
  drawScore();
  drawLives();
}

function drawPaddle() {
  context.drawImage(paddle, data.paddle.x, data.paddle.y, data.paddle.width, data.paddle.height);
}


function drawBall() {
  context.fillStyle = data.ball.fillStyle;
  context.beginPath();
  context.arc(data.ball.x, data.ball.y, data.ball.radius, 0, 2 * Math.PI);
  context.fill();
}

function loop() {
  hotlineMiami.play();
  if (!theAnd()) {
    requestAnimationFrame(loop);
    update();
    draw();
  }
  return;
}




document.addEventListener("keydown", function(evt) {
  if (evt.code === "ArrowRight") {
    data.paddle.xDelta = 8;
  } else if (evt.code === "ArrowLeft") {
    data.paddle.xDelta = -8;
  }
})

document.addEventListener("keyup", function() {
  data.paddle.xDelta = 0;
});

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function drawScore() {
  context.font = "20px cursive";
  context.fillStyle = "Blue";
  context.fillText("Score: " + data.score, 7, 25);
}


function drawLives() {
  context.font = "20px cursive";
  context.fillStyle = "Blue";
  context.fillText("Lives: " + data.lives, 720, 25);
}

function theAnd() {
  if (data.score === 32) {
    alert("You won!");
    document.location.reload()
    return true;
  }

  if (data.lives <= 0) {
    hotlineMiami.pause();
    soundTheAnd.play();
    alert("GAME OVER \n YOU LOSE");

    document.location.reload();
    return true;
  }

}


button.addEventListener("click", function() {
  loop();
});


document.addEventListener("mousemove", function(evt) {
  let relativeX = evt.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    data.paddle.x = relativeX - data.paddle.width / 2;
  }
});
