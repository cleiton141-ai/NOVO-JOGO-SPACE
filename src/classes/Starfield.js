class Starfield {
    constructor(width, height, count = 120) {
        this.stars = [];
        this.count = count;
        this.resize(width, height);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;

        if (this.stars.length === 0) {
            for (let index = 0; index < this.count; index += 1) {
                this.stars.push(this.createStar(true));
            }
        } else {
            for (const star of this.stars) {
                star.x = Math.min(star.x, width);
                star.y = Math.min(star.y, height);
            }
        }
    }

    createStar(randomizeY = false) {
        return {
            x: Math.random() * this.width,
            y: randomizeY ? Math.random() * this.height : -4,
            radius: Math.random() * 1.6 + 0.5,
            velocity: Math.random() * 1.6 + 0.5,
            brightness: Math.random() * 0.7 + 0.3,
        };
    }

    update() {
        for (let index = 0; index < this.stars.length; index += 1) {
            const star = this.stars[index];
            star.y += star.velocity;

            if (star.y - star.radius > this.height) {
                this.stars[index] = this.createStar();
            }
        }
    }

    draw(ctx) {
        for (const star of this.stars) {
            ctx.globalAlpha = star.brightness;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }
}

export default Starfield;