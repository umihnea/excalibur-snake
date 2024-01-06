import * as ex from "excalibur";

import { GridProperties } from "./constants";

const OPACITY_CHANGE = 0.25;

class FadingText extends ex.Actor {
    private text: string;
    private font: ex.Font;
    private opacity: number;

    constructor(props: { text: string; origin: ex.Vector; font: ex.Font }) {
        super({
            pos: props.origin,
            width: GridProperties.TILE_SIZE,
            height: GridProperties.TILE_SIZE,
            vel: new ex.Vector(0, -20),
        });

        this.text = props.text;
        this.font = props.font;
        this.opacity = 1.0;
    }

    onInitialize(_engine: ex.Engine): void {
        const text = new ex.Text({
            text: this.text,
            font: this.font,
        });
        this.graphics.opacity = this.opacity;
        this.graphics.add(text);
    }

    public onPostUpdate(_engine: ex.Engine, _delta: number): void {
        this.opacity -= OPACITY_CHANGE;
        this.graphics.opacity = this.opacity;

        if (this.opacity <= 0) {
            this.kill();
        }
    }
}

export default FadingText;
