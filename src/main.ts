import { Engine, Loader, Keys, CollisionEndEvent } from "excalibur";

import SnakeHead from "./snakeHead";
import BonusPoint from "./bonusPoint";
import { Resources } from "./resources";
import { GridProperties } from "./constants";
import { Directions, Direction } from "./directions";
import { GameState } from "./gameState";
import { vecToGrid } from "gridToReal";

class Game extends Engine {
  private gameState: GameState;

  constructor() {
    super({
      width: GridProperties.NUMBER_COLUMNS * GridProperties.TILE_SIZE,
      height: GridProperties.NUMBER_ROWS * GridProperties.TILE_SIZE,
      maxFps: 5,
    });

    this.gameState = this.initializeState();
  }

  private initializeState(): GameState {
    return {
      lastPressedDirection: Directions.NONE,
      score: 0,
      snakePositions: [],
    };
  }

  public initialize() {
    const snakeHead = new SnakeHead({
      row: 15,
      col: 15,
      gameState: this.gameState,
    });
    this.add(snakeHead);

    const initialPoint = new BonusPoint({ gameState: this.gameState });
    this.add(initialPoint);

    snakeHead.on("collisionend", (event: CollisionEndEvent) => {
      if (event.other instanceof BonusPoint) {
        this.gameState.score += 1;

        // Add new snake body segment to snake, where the bonus point was.
        // 1. Copy the point's position.
        const grid = vecToGrid(event.other.pos);
        // 2. Remove the point.
        this.remove(event.other);
        // 3. Add the segment position to state.
        this.gameState.snakePositions.push(grid);
        // 4. TODO: Add the segment entity to game.
        // const snakeSegment = new SnakeSegment({
        //   row: grid.row,
        //   col: grid.col,
        //   gameState: this.gameState,
        // });
        // this.add(snakeSegment);

        // Add a new bonus point
        const bonusPoint = new BonusPoint({ gameState: this.gameState });
        this.add(bonusPoint);

        // Remove the touched point
        this.remove(event.other);
      }
    });

    const loader = new Loader([Resources.Sword]);
    this.start(loader);

    this.showDebug(true);
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