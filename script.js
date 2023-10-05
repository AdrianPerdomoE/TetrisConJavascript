"use strict";
//Declaracion del tablero de juego y valores necesarios
const CANVAS = document.getElementById("CANVAS");
const CONTEXT = CANVAS.getContext("2d");
const PUNTAJE = document.getElementById("puntaje");
const BLOCK_SIZE = 20;
const BOARD_HEIGHT = 25;
const BOARD_WIDTH = 10;
const fps = 12;
let score = 0;
CANVAS.width = BLOCK_SIZE * BOARD_WIDTH;
CANVAS.height = BLOCK_SIZE * BOARD_HEIGHT;
CONTEXT.scale(BLOCK_SIZE, BLOCK_SIZE);
const BOARD = new Array(BOARD_HEIGHT).fill(0).map((value) => {
  return new Array(BOARD_WIDTH).fill(0);
});
// Declaracion de las formas
class Figure {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.shape = undefined;
    this.active = true;
    this.color = randomColor();
  }
  draw() {
    this.shape.forEach((row, y) =>
      row.forEach((value, x) => {
        if (value === 1) {
          CONTEXT.fillStyle = this.color;
          CONTEXT.fillRect(x + this.x, y + this.y, 1, 1);
        }
      })
    );
  }
  move(event) {
    switch (event) {
      case "ArrowLeft":
        {
          if (curretFigure.x - 1 >= 0 && BOARD[this.x - 1] != 1)
            curretFigure.x--;
        }
        break;
      case "ArrowRight":
        {
          if (
            curretFigure.x + 1 < BOARD_WIDTH - (this.shape[0].length - 1) &&
            BOARD[this.x + (this.shape[0].length - 1)]
          )
            curretFigure.x++;
        }
        break;
      case "ArrowDown":
        console.log("rotar");
        break;
      case "ArrowUp":
        console.log("rotar");
        break;
    }
  }
}
class Square extends Figure {
  constructor(x, y) {
    super(x, y);
    this.shape = [
      [1, 1],
      [1, 1],
    ];
  }
}
class Rectangle extends Figure {
  constructor(x, y) {
    super(x, y);
    this.shape = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
  }
}
class Line extends Figure {
  constructor(x, y) {
    super(x, y);
    this.shape = [
      [1, 1, 1],
      [1, 1, 1],
    ];
  }
}
//Funciones del juego
const COLORS = ["red", "blue", "gree"];
const FIGURES = [
  (x, y) => {
    return new Square(x, y);
  },
  (x, y) => {
    return new Rectangle(x, y);
  },
  (x, y) => {
    return new Line(x, y);
  },
];
let curretFigure = new Square(3, 3);
function moveFigure(event) {
  curretFigure.move(event.key);
}
document.addEventListener("keydown", moveFigure);
function randomColor() {
  return COLORS[Math.floor(Math.random() * (COLORS.length - 1))];
}

function killFigure(figure) {
  curretFigure.shape.forEach((rowFigure, yFigure) => {
    rowFigure.forEach((value, xFigure) => {
      BOARD[yFigure + curretFigure.y][xFigure + curretFigure.x] = value;
    });
    curretFigure.active = false;
  });
}

function getNextFigure() {
  let figure = FIGURES[Math.floor(Math.random() * FIGURES.length)];

  return figure(Math.floor(BOARD_WIDTH / 2), 0);
}

async function update() {
  if (!curretFigure.active) {
    curretFigure = getNextFigure();
  }
  if (
    BOARD[1].reduce((prev, curr) => {
      return prev + curr;
    }) > 0
  ) {
    alert("Fin del juego");
    return;
  }
  draw();

  setTimeout(() => {
    requestAnimationFrame(update);
  }, 1000 / fps);
}

function draw() {
  CONTEXT.fillStyle = "#000";
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
  BOARD.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        CONTEXT.fillStyle = "#aaa";
        CONTEXT.fillRect(x, y, 1, 1);
      } else {
        CONTEXT.fillStyle = "#000";
        CONTEXT.fillRect(x, y, 1, 1);
      }
    });
  });
  curretFigure.y++;

  curretFigure.draw();
  if (curretFigure.y + curretFigure.shape.length == BOARD_HEIGHT) {
    killFigure();
  } else {
    let floor = curretFigure.shape[curretFigure.shape.length - 1];
    floor.forEach((value, xFigure) => {
      if (value != 0) {
        let boardValue =
          BOARD[curretFigure.y + curretFigure.shape.length][
            xFigure + curretFigure.x
          ];

        if (boardValue == 1) {
          killFigure();
        }
      }
    });
  }
  let enteras = [];
  BOARD.forEach((row, index) => {
    if (row.every((value) => value == 1)) enteras.push(index);
  });
  enteras.forEach((val) => {
    BOARD.splice(val, 1);
    BOARD.unshift(new Array(BOARD_WIDTH).fill(0));
    score++;
    PUNTAJE.innerHTML = score;
  });
}

update();
