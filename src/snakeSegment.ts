import * as ex from "excalibur";

import { GridProperties } from "./constants";
import { gridToVec } from "./gridToReal";
import { GameState } from "./gameState";

class SnakeSegment extends ex.Actor {
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
            color: ex.Color.Green,
        });
        this.graphics.add(rectangle);
    }
};

export default SnakeSegment;