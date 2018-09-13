class SnakeGame {
  constructor() {
    this.$app = document.querySelector('#app');
    this.$canvas = this.$app.querySelector('canvas');
    this.ctx = this.$canvas.getContext('2d');
    this.$score = this.$app.querySelector('.score');

    this.settings = {
      canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: '#A2C359',
        border: '#000'
      },
      snake: {
        size: 30,
        background: 'red',
        border: 'black'
      }
    };

    this.game = {
      score: 0,
      speed: 200,
      direction: 'right',
      keyCodes: {
        38: 'up',
        40: 'down',
        39: 'right',
        37: 'left'
      }  
    };

    // The snake starts off with 5 pieces
    // Each piece is 30x30 pixels
    // Each following piece must be n times as far from the first piece
    const x = 300;
    const y = 300;

    this.snake = [
      { x: x, y: y },
      { x: x - this.settings.snake.size, y: y },
      { x: x - (this.settings.snake.size * 2), y: y },
      { x: x - (this.settings.snake.size * 3), y: y },
      { x: x - (this.settings.snake.size * 4), y: y }
    ];

    this.food = {
      active: false,
      coordinates: {
        x: 0,
        y: 0  
      }
    };

    this.init();
  }

  init() {
    this.generateSnake();

    // Start the game
    const startGame = setInterval(() => {
      if(!this.detectCollision()) {
        this.generateSnake();
      } else {
        clearInterval(startGame);
      }
    }, this.game.speed);

    // Change direction
    document.addEventListener('keydown', event => {
      this.changeDirection(event.keyCode);
    });
  }

  changeDirection(keyCode) {
    const validKeyPress = Object.keys(this.game.keyCodes).includes(keyCode.toString()); // Only allow (up|down|left|right)

    if(validKeyPress && this.validateDirectionChange(this.game.keyCodes[keyCode], this.game.direction)) {
      this.game.direction = this.game.keyCodes[keyCode];
    }
  }

  // When already moving in one direction snake shouldn't be allowed to move in the opposite direction
  validateDirectionChange(keyPress, currentDirection) {
    return (keyPress === 'left' && currentDirection !== 'right') || 
      (keyPress === 'right' && currentDirection !== 'left') ||
      (keyPress === 'up' && currentDirection !== 'down') ||
      (keyPress === 'down' && currentDirection !== 'up');
  }

  setResetCanvas() {
    // Full screen size
    this.$canvas.width = this.settings.canvas.width;
    this.$canvas.height = this.settings.canvas.height;

    // Background
    this.ctx.fillStyle = this.settings.canvas.background;
    this.ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
  }

  drawSnake() {
    const size = this.settings.snake.size;

    this.ctx.fillStyle = this.settings.snake.background;
    this.ctx.strokestyle = this.settings.snake.border;

    // Draw each piece
    this.snake.forEach(coordinate => {
      this.ctx.fillRect(coordinate.x, coordinate.y, size, size);
      this.ctx.strokeRect(coordinate.x, coordinate.y, size, size);
    });
  }

  generateSnake() {
    let coordinate;

    switch(this.game.direction) {
      case 'right':
        coordinate = {
          x: this.snake[0].x + this.settings.snake.size,
          y: this.snake[0].y
        };
      break;
      case 'up':
        coordinate = {
          x: this.snake[0].x,
          y: this.snake[0].y - this.settings.snake.size
        };
      break;
      case 'left':
        coordinate = {
          x: this.snake[0].x - this.settings.snake.size,
          y: this.snake[0].y
        };
      break;
      case 'down':
        coordinate = {
          x: this.snake[0].x,
          y: this.snake[0].y + this.settings.snake.size
        };
    }

    // The snake moves by adding a piece to the beginning "this.snake.unshift(coordinate)" and removing the last piece "this.snake.pop()"
    // Except when it eats the food in which case there is no need to remove a piece and the added piece will make it grow
    this.snake.unshift(coordinate);
    this.setResetCanvas();

    const ateFood = this.snake[0].x === this.food.coordinates.x && this.snake[0].y === this.food.coordinates.y;

    if(ateFood) {
      this.food.active = false;
      this.game.score += 10;
      this.$score.innerText = this.game.score;
    } else {
      this.snake.pop();
    }

    this.generateFood();
    this.drawSnake();
  }

  generateFood() {
    // If there is uneaten food on the canvas there's no need to regenerate it
    if(this.food.active) {
      this.drawFood(this.food.coordinates.x, this.food.coordinates.y);
      return;
    }

    const gridSize = this.settings.snake.size;
    const xMax = this.settings.canvas.width - gridSize;
    const yMax = this.settings.canvas.height - gridSize;

    const x = Math.round((Math.random() * xMax) / gridSize) * gridSize;
    const y = Math.round((Math.random() * yMax) / gridSize) * gridSize;

    // Make sure the generated coordinates do not conflict with the snake's present location
    // If so recall this method recursively to try again
    this.snake.forEach(coordinate => {
      const foodSnakeConflict = coordinate.x == x && coordinate.y == y;

      if(foodSnakeConflict) {
        alert('conflict!');
        this.generateFood();
      } else {
        this.drawFood(x, y);
      }
    });
  }

  drawFood(x, y) {
    const size = this.settings.snake.size;

    this.ctx.fillStyle = this.settings.snake.background;
    this.ctx.strokestyle = this.settings.snake.border;

    this.ctx.fillRect(x, y, size, size);
    this.ctx.strokeRect(x, y, size, size);

    this.food.active = true;
    this.food.coordinates.x = x;
    this.food.coordinates.y = y;
  }

  detectCollision() {
    // Self collison
    // It's impossible for the first 3 pieces of the snake to self collide so the loop starts at 4
    for(let i = 4; i < this.snake.length; i++) {
      const selfCollison = this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y;

      if(selfCollison) {
        return true;
      }
    }

    // Wall collison
    const leftCollison = this.snake[0].x < 0;
    const topCollison = this.snake[0].y < 0;
    const rightCollison = this.snake[0].x > this.$canvas.width - this.settings.snake.size;
    const bottomCollison = this.snake[0].y > this.$canvas.height - this.settings.snake.size;

    return leftCollison || topCollison || rightCollison || bottomCollison;
  }
}

const snakeGame = new SnakeGame();
