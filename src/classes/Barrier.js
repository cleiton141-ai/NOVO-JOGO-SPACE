class Barrier {
    constructor(x, y, width, height) {
        this.position = { x, y };
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = "#6ee7b7";
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}

export default Barrier;