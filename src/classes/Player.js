class Player {
    constructor(canvaswidth, canvasheight) {
        this.width = 100;
        this.height = 100;
        this.position = {
            x: canvaswidth / 2 - this.width / 2,
            y: canvasheight - this.height - 30,
        };
    }

    draw(ctx) {
        ctx.fillStyle = "red"
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}

export default Player;