import * as ex from "excalibur";

import { GridProperties } from "./constants";
import { GridPosition } from "./types";
import gridToVec from "./gridToReal";

class SnakeHead extends ex.Actor {
    constructor(initialGridPosition: GridPosition) {
        super({
            pos: gridToVec(initialGridPosition),
            width: GridProperties.TILE_SIZE,
            height: GridProperties.TILE_SIZE,
        });
    }

    onInitialize() {
        const rectangle = new ex.Rectangle({
            width: this.width,
            height: this.height,
            color: ex.Color.Yellow,
        });
        this.graphics.add(rectangle);

        this.on('pointerup', () => {
            alert('yo');
        });
    }

}

export default SnakeHead;