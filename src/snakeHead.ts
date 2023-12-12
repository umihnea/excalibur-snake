import * as ex from "excalibur";

import { GridProperties } from "./constants";
import { gridToVec, vecToGrid } from "./gridToReal";
import { GameState } from "./gameState";
import { Directions } from "./directions";

const DIFFS = Object.freeze({
    [Directions.UP]: { rows: -1, cols: 0 },
    [Directions.DOWN]: { rows: 1, cols: 0 },
    [Directions.LEFT]: { rows: 0, cols: 1 },
    [Directions.RIGHT]: { rows: 0, cols: -1 },
}) as Readonly<Record<string, { rows: number; cols: number; }>>;

class SnakeHead extends ex.Actor {
    private readonly gameState;

    constructor(props: { row: number; col: number; gameState: GameState }) {
        super({
            pos: gridToVec({ row: props.row, col: props.col }),
            width: GridProperties.TILE_SIZE,
            height: GridProperties.TILE_SIZE,
        });

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

    public onPostUpdate(engine: ex.Engine, _delta: number) {
        // Move the snake head
        const direction = this.gameState.lastPressedDirection;
        if (direction && DIFFS[direction]) {
            const { row, col } = vecToGrid(this.pos);
            const nextPos = gridToVec({
                row: (row + DIFFS[direction].rows) % GridProperties.NUMBER_ROWS,
                col: (col + DIFFS[direction].cols) % GridProperties.NUMBER_COLUMNS
            });

            this.pos.setTo(nextPos.x, nextPos.y);
        } else {
            console.warn("No direction.", JSON.stringify({ direction, diff: DIFFS?.[direction] }));
        }
    }

}

export default SnakeHead;