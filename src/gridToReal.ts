import { Vector, vec } from "excalibur";

import { GridProperties } from "./constants";

export const gridToVec = (gridCoords: GridPosition) => {
    return vec(
        gridCoords.row * GridProperties.TILE_SIZE,
        gridCoords.col * GridProperties.TILE_SIZE
    );
};

export const vecToGrid = (vector: Vector): GridPosition => {
    return {
        row: Math.floor(vector.x / GridProperties.TILE_SIZE),
        col: Math.floor(vector.y / GridProperties.TILE_SIZE),
    };
};

export default gridToVec;