import { Engine, Loader, Keys, CollisionEndEvent, Font } from "excalibur";

import SnakeHead from "./snakeHead";
import SnakeSegment from "./snakeSegment";
import BonusPoint from "./bonusPoint";
import FadingText from "./fadingText";
import { GridProperties } from "./constants";
import { Directions, Direction } from "./directions";
import { GameState } from "./gameState";
import { gridToVec, vecToGrid } from "./gridToReal";

const X_AXIS_DIRECTIONS = Object.freeze([
    Directions.LEFT,
    Directions.RIGHT,
]) as readonly Direction[];

const Y_AXIS_DIRECTIONS = Object.freeze([
    Directions.UP,
    Directions.DOWN,
]) as readonly Direction[];

class Game extends Engine {
    private gameState: GameState;
    private segmentPool: SnakeSegment[];
    private previousSnakeHeadGrid: null | GridPosition;
    private font: Font;

    constructor() {
        super({
            width: GridProperties.NUMBER_COLUMNS * GridProperties.TILE_SIZE,
            height: GridProperties.NUMBER_ROWS * GridProperties.TILE_SIZE,
            maxFps: 5,
        });

        this.gameState = this.initializeState();
        this.segmentPool = [];
        this.previousSnakeHeadGrid = null;
        this.font = new Font({ size: 20 });
    }

    private initializeState(): GameState {
        return {
            lastPressedDirection: Directions.NONE,
            score: 0,
            snakePositions: [],
            snakeHeadGrid: null,
        };
    }

    public initialize() {
        const snakeHead = new SnakeHead({
            row: 15,
            col: 15,
            gameState: this.gameState,
        });
        this.add(snakeHead);
        this.addSnakeSegment({
            row: 15,
            col: 14,
        });

        const initialPoint = new BonusPoint({ gameState: this.gameState });
        this.add(initialPoint);

        snakeHead.on("collisionend", (event: CollisionEndEvent) => {
            if (event.other instanceof BonusPoint) {
                this.gameState.score += 1; // TODO: Show score UI element.

                // Add new snake body segment to snake, where the bonus point was.
                const grid = vecToGrid(event.other.pos);
                this.addSnakeSegment(grid);

                // Add a new bonus point
                const bonusPoint = new BonusPoint({
                    gameState: this.gameState,
                });
                this.add(bonusPoint);

                // Remove the touched point
                this.remove(event.other);
            }
        });

        const loader = new Loader([]);
        this.start(loader);

        this.showDebug(true);
    }

    private addSnakeSegment(grid: GridPosition) {
        const snakeSegment = new SnakeSegment({
            row: grid.row,
            col: grid.col,
            gameState: this.gameState,
        });

        this.add(snakeSegment);
        this.gameState.snakePositions.push(grid);
        this.segmentPool.push(snakeSegment);
    }

    public onPostUpdate(engine: Engine, _delta: number) {
        const direction = this.pollDirection(engine);
        if (direction && direction != this.gameState.lastPressedDirection) {
            const allowed = this.isDirectionAllowed(
                this.gameState.lastPressedDirection,
                direction
            );

            if (allowed) {
                this.gameState.lastPressedDirection = direction;
            } else if (this.gameState.snakeHeadGrid) {
                this.add(
                    new FadingText({
                        text: "can't",
                        origin: gridToVec(this.gameState.snakeHeadGrid),
                        font: this.font,
                    })
                );
            }
        }

        if (
            this.segmentPool?.length &&
            this.gameState.snakeHeadGrid &&
            this.gameState.snakeHeadGrid !== this.previousSnakeHeadGrid
        ) {
            // Push last head position to queue and pop last.
            if (this.previousSnakeHeadGrid) {
                this.gameState.snakePositions.unshift(
                    this.previousSnakeHeadGrid
                );
                this.gameState.snakePositions.pop();
            }

            this.previousSnakeHeadGrid = this.gameState.snakeHeadGrid;

            // Sync the segments to the snakePositions.
            for (
                let index = 0;
                index < this.gameState.snakePositions.length;
                index++
            ) {
                this.segmentPool[index].pos = gridToVec(
                    this.gameState.snakePositions[index]
                );
            }
        }
    }

    private isDirectionAllowed(
        lastDirection: Direction,
        currentDirection: Direction
    ): boolean {
        // Only allow two consecutive directions if they are from
        // different axes.
        if (
            lastDirection === Directions.NONE ||
            currentDirection === Directions.NONE
        ) {
            return true;
        }

        return (
            (X_AXIS_DIRECTIONS.indexOf(lastDirection) !== -1 &&
                Y_AXIS_DIRECTIONS.indexOf(currentDirection) !== -1) ||
            (Y_AXIS_DIRECTIONS.indexOf(lastDirection) !== -1 &&
                X_AXIS_DIRECTIONS.indexOf(currentDirection) !== -1)
        );
    }

    private pollDirection(engine: Engine): Maybe<Direction> {
        const directionMap: Record<string, boolean> = {
            [Directions.UP]: engine.input.keyboard.wasPressed(Keys.Up),
            [Directions.DOWN]: engine.input.keyboard.wasPressed(Keys.Down),
            [Directions.LEFT]: engine.input.keyboard.wasPressed(Keys.Left),
            [Directions.RIGHT]: engine.input.keyboard.wasPressed(Keys.Right),
        };

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
