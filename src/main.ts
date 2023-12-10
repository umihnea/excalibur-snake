import { Engine, Loader } from "excalibur";

import SnakeHead from "./snakeHead";
import { Resources } from "./resources";
import { GridProperties } from "./constants";

class Game extends Engine {
  constructor() {
    super({
      width: GridProperties.NUMBER_COLUMNS * GridProperties.TILE_SIZE,
      height: GridProperties.NUMBER_ROWS * GridProperties.TILE_SIZE,
    });
  }

  initialize() {
    const snakeHead = new SnakeHead({ row: 15, col: 15 });
    this.add(snakeHead);

    const loader = new Loader([Resources.Sword]);
    this.start(loader);
  }
}

export const game = new Game();
game.initialize();