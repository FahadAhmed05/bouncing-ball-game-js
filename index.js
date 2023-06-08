let ball;
let bar;
let leftWall;
let rightWall;
let topWall;
const width = 1340;
const height = 500;
let timer = 0;
let speedIncreaseInterval = 1000; // Increase speed every 1 second
let speedIncreaseAmount = 1; // Amount to increase the ball's speed
let gameStarted = false;

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent("canvas-container");
  background(0);
}

function draw() {
  fill(0);
  background(0);

  timer += frameRate() / 60;

  if (gameStarted) {
    if (ball) {
      ball.display();
      ball.move();

      if (bar && ball.collideWith(bar)) {
        console.log("Collision Bar and Ball", bar.width, bar.height);
        // Reverse the vertical speed of the ball
        ball.yspeed *= -1;
      }
    }

    if (bar) {
      bar.display();
      bar.move();
    }

    if (leftWall) {
      leftWall.display();
    }

    if (rightWall) {
      rightWall.display();
    }

    if (topWall) {
      topWall.display();
    }
  }

  if (timer >= speedIncreaseInterval) {
    timer = 0; // Reset the timer
    ball.xspeed += speedIncreaseAmount; // Increase the ball's horizontal speed
    ball.yspeed += speedIncreaseAmount; // Increase the ball's vertical speed
  }
}


class Ball {
  constructor() {
    // Initialize properties
    this.x = random(width - 50); // center
    this.y = 20;
    this.r = 25;
    this.yspeed = 2;
    this.xspeed = 2;
    if (this.x < 50) {
      this.x = 50;
    }
  }

  collideWith(other) {
    const dx = Math.abs(this.x - other.x);
    const dy = Math.abs(this.y - other.y);

    if (dx > other.width / 2 + this.r) {
      return false; // No horizontal overlap
    }

    if (dy > other.height / 2 + this.r) {
      return false; // No vertical overlap
    }

    if (dx <= other.width / 2) {
      return true; // Horizontal collision
    }

    if (dy <= other.height / 2) {
      return true; // Vertical collision
    }

    // Check for collision at the corners
    const cornerDistanceSq =
      (dx - other.width / 2) ** 2 + (dy - other.height / 2) ** 2;
    return cornerDistanceSq <= this.r ** 2;
  }

  display() {
    // Set the colors for the ball
    let outerColor = color(255, 100, 100); // Outer color
    let innerColor = color(255); // Inner color

    // Set the gradient for the ball
    let gradient = drawingContext.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.r
    );
    gradient.addColorStop(0, outerColor);
    gradient.addColorStop(1, innerColor);

    // Set the stroke properties for the ball
    stroke(255, 150);
    strokeWeight(2);

    // Apply the gradient and stroke to the ball
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;

    // Draw the ball
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    // Check if the ball hits the top wall
    if (this.y - this.r <= topWall.y + topWall.height) {
      this.y = topWall.y + topWall.height + this.r; // Set the ball just below the top wall
      this.yspeed *= -1; // Reverse the vertical speed of the ball
    }

    // Check if the ball hits the left wall
    if (this.x - this.r <= leftWall.x + leftWall.width) {
      this.x = leftWall.x + leftWall.width + this.r; // Set the ball just to the right of the left wall
      this.xspeed = Math.abs(this.xspeed); // Reverse the horizontal speed of the ball
    }

    // Check if the ball hits the right wall
    if (this.x + this.r >= rightWall.x) {
      this.x = rightWall.x - this.r; // Set the ball just to the left of the right wall
      this.xspeed = -Math.abs(this.xspeed); // Reverse the horizontal speed of the ball
    }
  }
}

class Bar {
  constructor() {
    this.x = width / 2;
    this.y = height - 40;
    this.width = 100;
    this.height = 30;
    this.speed = 5;
  }
  display() {
    fill(255);
    rect(this.x, this.y, 100, 30);
  }
  move() {
    if (keyIsDown(LEFT_ARROW) && this.x > leftWall.x + leftWall.width) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x + this.width < rightWall.x) {
      this.x += this.speed;
    }
  }
}

class Wall {
  constructor(xpos, ypos, width, height) {
    this.x = xpos;
    this.y = ypos;
    this.width = width;
    this.height = height;
  }
  display() {
    // Draw the left wall
    strokeWeight(0);
    stroke(0);
    fill(255, 0, 0); // Set the color of the left wall
    rect(this.x, this.y, this.width, this.height);
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    ball = new Ball();
    bar = new Bar();
    // left Wall
    leftWall = new Wall(0, 0, 30, height);
    // right wall
    rightWall = new Wall(width - 30, 0, 30, height);
    // top wall
    topWall = new Wall(0, 0, width, 30);
  }
}
