import * as ex from "excalibur";

import { GridProperties } from "./constants";
import { gridToVec, vecToGrid } from "./gridToReal";
import { GameState } from "./gameState";
import { Directions } from "./directions";

const DIFFS = Object.freeze({
    [Directions.UP]: { rows: 0, cols: -1 },
    [Directions.DOWN]: { rows: 0, cols: 1 },
    [Directions.LEFT]: { rows: -1, cols: 0 },
    [Directions.RIGHT]: { rows: 1, cols: 0 },
}) as Readonly<Record<string, { rows: number; cols: number; }>>;

class SnakeHead extends ex.Actor {
    private readonly gameState;

    constructor(props: { row: number; col: number; gameState: GameState }) {
        super({
            pos: gridToVec({ row: props.row, col: props.col }),
            width: GridProperties.TILE_SIZE,
            height: GridProperties.TILE_SIZE,
        });
        this.body.collisionType = ex.CollisionType.Passive;
        this.gameState = props.gameState;
    }

    onInitialize() {
        const rectangle = new ex.Rectangle({
            width: this.width,
            height: this.height,
            color: ex.Color.Yellow,
        });
        this.graphics.add(rectangle);
    }

    private advanceGridPosition(
        current: number, delta: number, end: number
    ): number {
        if (current < 0) {
            return end - 1;
        }

        return (current + delta) % end;
    }

    public onPostUpdate(engine: ex.Engine, _delta: number) {
        // Move the snake head
        const direction = this.gameState.lastPressedDirection;
        if (direction && DIFFS[direction]) {
            const { row, col } = vecToGrid(this.pos);
            const nextGrid = {
                row: this.advanceGridPosition(
                    row, DIFFS[direction].rows, GridProperties.NUMBER_ROWS
                ),
                col: this.advanceGridPosition(
                    col, DIFFS[direction].cols, GridProperties.NUMBER_COLUMNS
                ),
            };
            const nextPos = gridToVec(nextGrid);
            this.pos.setTo(nextPos.x, nextPos.y);

            // Push this position to the game state move history as well
            // in order to be able to move the snake's segments.
            this.gameState.lastSnakeHeadGrid = nextGrid;
        } else {
            console.warn("No direction.", JSON.stringify({ direction, diff: DIFFS?.[direction] }));
        }
    }
}

export default SnakeHead;