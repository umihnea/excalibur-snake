import * as ex from "excalibur";

import { GridProperties } from "./constants";
import { gridToVec } from "./gridToReal";
import { GameState } from "./gameState";

class BonusPoint extends ex.Actor {
    private readonly gameState: GameState;

    constructor(props: { gameState: GameState }) {
        super({
            // Start by rendering it off-screen
            pos: ex.vec(-GridProperties.TILE_SIZE, -GridProperties.TILE_SIZE),
            width: GridProperties.TILE_SIZE,
            height: GridProperties.TILE_SIZE,
        });

        // From excaliburjs.com/docs: If two Fixed bodies meet they will not be pushed or moved by each other,
        // they will not interact except to throw collision events.
        this.body.collisionType = ex.CollisionType.Passive;

        this.gameState = props.gameState;
    }

    onInitialize() {
        const rectangle = new ex.Rectangle({
            width: this.width,
            height: this.height,
            color: ex.Color.Red,
        });
        this.pos = this._pickPosition();

        this.graphics.add(rectangle);
    }

    /**
     * Place it at random and use the game state to avoid placing
     * it directly on any of the current snake positions.
     */
    private _pickPosition(): ex.Vector {
        const forbiddenGrids: GridPosition[] = [
            ...this.gameState.snakePositions,
            ...(this.gameState.lastSnakeHeadGrid
                ? [this.gameState.lastSnakeHeadGrid]
                : []),
        ];

        let row = -1;
        let col = -1;
        let done = false;
        while (!done) {
            row = this._randint(0, GridProperties.NUMBER_ROWS - 1);
            col = this._randint(0, GridProperties.NUMBER_COLUMNS - 1);

            // Assume the solution is right.
            done = true;

            // Check for any collisions.
            for (const grid of forbiddenGrids) {
                if (row === grid.row && col === grid.col) {
                    done = false;
                }
            }
        }

        if (row === -1 && col === -1) {
            console.error(
                "Picking logic did not run.",
                JSON.stringify({ forbiddenGrids, row, col })
            );
        }

        return gridToVec({ row, col });
    }

    private _randint(_min: number, _max: number): number {
        return Math.floor(Math.random() * (_max - _min + 1)) + _min;
    }
}

export default BonusPoint;
