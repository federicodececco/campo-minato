enum Grades {
  easy = "EASY",
  medium = "MEDIUM",
  hard = "HARD",
}

export class Settings {
  length: number;
  difficulty: string;
  constructor(x: number, difficulty: string) {
    this.difficulty = difficulty;
    this.length = x;
  }
}

export class Grid {
  sideLength: number;
  difficulty: Grades;
  constructor(x: number, difficulty: Grades = Grades.easy) {
    this.sideLength = x;
    this.difficulty = difficulty;
  }
}

export class Casella {
  bomba: boolean;
  proximity: number;
  turned: boolean;
  constructor(
    bomba: boolean = false,
    proximity: number = 0,
    turned: boolean = false
  ) {
    this.bomba = bomba;
    this.proximity = proximity;
    this.turned = turned;
  }
}

function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/**
 ** {number} n : lunghezza del lato della board
 ** {number} bombe: numero di bombe
 *
 */
export function generateGrid(board: Grid, bombe?: number): Casella[][] {
  const n = board.sideLength;

  let grid: Casella[][] = [];
  let numBombe: number = 16;
  /* crea un numero di bombe pari al 20% della board o 16, quello più piccolo */
  /* if (bombe === undefined) {
    const maxBombe = Math.floor(n * n * 0.2);
    numBombe = Math.min(16, maxBombe);
  } else {
    numBombe = bombe;
  } */

  /* riempie la board */
  for (let i = 0; i < n; i++) {
    grid[i] = [];
    for (let j = 0; j < n; j++) {
      grid[i][j] = new Casella();
    }
  }
  let i = 0;
  /* posiziona le bombe sulla board */
  while (i < numBombe) {
    let x = getRandomInt(0, n - 1);
    let y = getRandomInt(0, n - 1);

    if (!grid[y][x].bomba) {
      grid[y][x].bomba = true;
      i++;

      for (let k = -1; k <= 1; k++) {
        for (let j = -1; j <= 1; j++) {
          const newY = y + k;
          const newX = x + j;

          if (
            newY >= 0 &&
            newY < n &&
            newX >= 0 &&
            newX < n &&
            !(k === 0 && j === 0)
          ) {
            grid[newY][newX].proximity++;
          }
        }
      }
    }
  }

  return grid;
}
