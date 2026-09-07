class Laser {
    constructor(x, y, velocityX, velocityY, color) {
        this.width = 5;
        this.height = 14;
        this.position = { x, y };
        this.velocity = { x: velocityX, y: velocityY };
        this.color = color;
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    isOutside(canvas) {
        return (
            this.position.x + this.width < 0 ||
            this.position.x > canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y > canvas.height
        );
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}

export default Laser;