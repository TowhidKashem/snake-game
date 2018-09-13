class SnakeGame {
  constructor() {
    this.$app = document.querySelector('#app');
    this.$canvas = this.$app.querySelector('canvas');
    this.ctx = this.$canvas.getContext('2d');

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
      speed: 200,
      direction: 'right',
      keyCodes: {
        38: 'up',
        40: 'down',
        39: 'right',
        37: 'left'
      }  
    }

    // Lets display the snake in the center of the screen
    const x = (window.innerWidth / 2) - this.settings.snake.size;
    const y = (window.innerHeight / 2) - this.settings.snake.size;

    // The snake starts off with 5 pieces
    // Each piece is 20x20 pixels
    // Each following piece must be n times as far from the first piece
    this.coordinates = [
      { x: x, y: y },
      { x: x - this.settings.snake.size, y: y },
      { x: x - (this.settings.snake.size * 2), y: y },
      { x: x - (this.settings.snake.size * 3), y: y },
      { x: x - (this.settings.snake.size * 4), y: y }
    ];

    this.init();
  }

  init() {
    this.setResetCanvas();
    this.drawSnake();

    setInterval(() => {
      this.moveSnake();
    }, this.game.speed);

    // Change direction
    document.addEventListener('keydown', event => {
      this.changeDirection(event.keyCode);
    });
  }

  changeDirection(keyCode) {
    const validKeyPress = Object.keys(this.game.keyCodes).includes(keyCode.toString()); // Only allow (up|down|left|right)

    if(validKeyPress) {
      if(this.validateDirectionChange(this.game.keyCodes[keyCode], this.game.direction)) {
        this.game.direction = this.game.keyCodes[keyCode];
      }
    }
  }

  // When moving in one direction snake shouldn't be allowed to move in the opposite direction
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
    this.coordinates.forEach(coordinate => {
      this.ctx.fillRect(coordinate.x, coordinate.y, size, size);
      this.ctx.strokeRect(coordinate.x, coordinate.y, size, size);
    });
  }

  moveSnake() {
    let coordinate;

    switch(this.game.direction) {
      case 'right':
        coordinate = {
          x: this.coordinates[0].x + this.settings.snake.size,
          y: this.coordinates[0].y
        };
      break;
      case 'up':
        coordinate = {
          x: this.coordinates[0].x,
          y: this.coordinates[0].y - this.settings.snake.size
        };
      break;
      case 'left':
        coordinate = {
          x: this.coordinates[0].x - this.settings.snake.size,
          y: this.coordinates[0].y
        };
      break;
      case 'down':
        coordinate = {
          x: this.coordinates[0].x,
          y: this.coordinates[0].y + this.settings.snake.size
        };
    }

    this.coordinates.unshift(coordinate);
    this.coordinates.pop();

    this.setResetCanvas();
    this.drawSnake();
  }




}

const snakeGame = new SnakeGame();
