import { Engine, Loader, Keys } from "excalibur";

import SnakeHead from "./snakeHead";
import { Resources } from "./resources";
import { GridProperties } from "./constants";
import { Directions, Direction } from "./directions";
import { GameState } from "./gameState";

class Game extends Engine {
  private gameState: GameState;

  constructor() {
    super({
      width: GridProperties.NUMBER_COLUMNS * GridProperties.TILE_SIZE,
      height: GridProperties.NUMBER_ROWS * GridProperties.TILE_SIZE,
    });

    this.gameState = this.initializeState();
  }

  private initializeState(): GameState {
    return {
      lastPressedDirection: Directions.NONE,
    };
  }

  public initialize() {
    const snakeHead = new SnakeHead({
      row: 15,
      col: 15,
      gameState: this.gameState,
    });
    this.add(snakeHead);

    const loader = new Loader([Resources.Sword]);
    this.start(loader);
  }

  public onPostUpdate(engine: Engine, _delta: number) {
    // Update to a new direction, if any
    const direction = this.pollDirection(engine);
    if (direction && direction != this.gameState.lastPressedDirection) {
      this.gameState.lastPressedDirection = direction;
    }
  }

  private pollDirection(engine: Engine): Maybe<Direction> {
    const directionMap: Record<string, boolean> = {
      [Directions.UP]: engine.input.keyboard.wasPressed(Keys.Up),
      [Directions.DOWN]: engine.input.keyboard.wasPressed(Keys.Down),
      [Directions.LEFT]: engine.input.keyboard.wasPressed(Keys.Left),
      [Directions.RIGHT]: engine.input.keyboard.wasPressed(Keys.Right),
    }

    for (const direction of Object.keys(directionMap)) {
      const wasPressed = directionMap[direction];
      if (wasPressed) {
        return direction as Direction;
      }
    }

    return;
  }
}

export const game = new Game();
game.initialize();