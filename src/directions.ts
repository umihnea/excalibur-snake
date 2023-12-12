export const Directions = Object.freeze({
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
    NONE: "none",
});

export type Direction = typeof Directions[keyof typeof Directions];