import * as ex from "excalibur";

class ScoreScreen extends ex.Scene {
    private _scoreLabel: ex.ScreenElement | null;
    private _font: ex.Font;

    constructor() {
        super();
        this._font = new ex.Font({ size: 30 });
        this._scoreLabel = null;
    }

    public onInitialize(_engine: ex.Engine): void {
        const gOverLabel = new ex.ScreenElement({
            x: _engine.drawHeight / 2 - 90,
            y: _engine.drawWidth / 2,
        });
        this._scoreLabel = new ex.ScreenElement({
            x: _engine.drawHeight / 2 - 90,
            y: _engine.drawWidth / 2 + 100,
        });
        gOverLabel.graphics.add(
            new ex.Text({
                text: "GAME OVER.",
                font: this._font,
            })
        );

        this.add(gOverLabel);
        this.add(this._scoreLabel);
    }

    public onActivate(
        _context: ex.SceneActivationContext<{ score: number }>
    ): void {
        const { data } = _context;
        if (this._scoreLabel) {
            this._scoreLabel.graphics.add(
                new ex.Text({
                    text: `Score: ${data?.score}`,
                    font: this._font,
                })
            );
        }
    }
}

export default ScoreScreen;
