import { Direction } from "./directions";

export type GameState = {
    lastPressedDirection: Direction;
    score: number;
    snakePositions: GridPosition[];
    snakeHeadGrid: null | GridPosition;
    gameOver: boolean;
};
