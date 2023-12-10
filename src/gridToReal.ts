import { vec } from "excalibur";

import { GridPosition } from "./types";
import { GridProperties } from "./constants";

const gridToVec = (gridCoords: GridPosition) => {
    return vec(
        gridCoords.row * GridProperties.TILE_SIZE,
        gridCoords.col * GridProperties.TILE_SIZE
    );
};

export default gridToVec;