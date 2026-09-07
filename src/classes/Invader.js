import { PATH_INVADER_IMAGE } from "../utils/constants.js";


class Invader {
    constructor(canvaswidth) {
        this.width = 60;
        this.height = 60;
        this.columns = 10;
        this.rows = 2;
        this.velocity = 2;
        this.maxVelocity = 5;
        this.direction = 1;
        this.spacing = 0;
        this.formationWidth = 0;
        this.invaders = [];
        this.offsets = [];

        this.position = {
            x: 0,
            y: 30,
        };

        this.image = new Image();
        this.image.src = PATH_INVADER_IMAGE;
        this.canvaswidth = canvaswidth;

        this.resetFormation(false);
    }

    resetFormation(random = false) {
        const formation = random ? this.getRandomFormation() : this.getInitialFormation();

        this.offsets = formation;
        this.formationWidth = Math.max(...formation.map((offset) => offset.x)) + this.width;
        this.invaders = formation.map((offset) => ({ ...offset, alive: true }));
        this.position.x = 0;
        this.position.y = 30;
        this.direction = 1;
        this.velocity = 2;
    }

    getInitialFormation() {
        const formation = [];

        for (let row = 0; row < 2; row += 1) {
            for (let column = 0; column < 10; column += 1) {
                formation.push({
                    x: column * (this.width + this.spacing),
                    y: row * (this.height + this.spacing),
                });
            }
        }

        return formation;
    }

    getRandomFormation() {
        const formations = [
            [
                [0, 0, 0, 0, 1, 1, 1, 1, 2, 2],
                [0, 0, 0, 0, 1, 1, 1, 1, 2, 2],
            ],
            [
                [0, 0, 1, 1, 1, 1, 2, 2, 2, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 1, 1, 1, 1, 2, 2, 2],
                [2, 2, 2, 1, 1, 1, 1, 0, 0, 0],
            ],
        ];
        const selectedFormation = formations[Math.floor(Math.random() * formations.length)];
        const offsets = [];

        for (let row = 0; row < 2; row += 1) {
            for (let column = 0; column < 10; column += 1) {
                offsets.push({
                    x: column * (this.width + this.spacing),
                    y: selectedFormation[row][column] * (this.height + this.spacing),
                });
            }
        }

        return offsets;
    }

    update(canvaswidth) {
        this.canvaswidth = canvaswidth;
        this.position.x += this.velocity * this.direction;

        if (this.position.x + this.formationWidth >= this.canvaswidth) {
            this.position.x = Math.max(0, this.canvaswidth - this.formationWidth);
            this.direction = -1;
            this.position.y += 1;
            this.velocity = Math.min(this.velocity + 1, this.maxVelocity);
        }

        if (this.position.x <= 0) {
            this.position.x = 0;
            this.direction = 1;
            this.position.y += 1;
            this.velocity = Math.min(this.velocity + 1, this.maxVelocity);
        }
    }

    draw(ctx) {
        if (this.image.complete && this.image.naturalWidth > 0) {
            for (const invader of this.invaders) {
                if (invader.alive) {
                    ctx.drawImage(
                        this.image,
                        this.position.x + invader.x,
                        this.position.y + invader.y,
                        this.width,
                        this.height
                    );
                }
            }
        }
    }

    getAliveInvaders() {
        return this.invaders.filter((invader) => invader.alive);
    }

    isCleared() {
        return this.getAliveInvaders().length === 0;
    }

    getBounds(invader) {
        return {
            x: this.position.x + invader.x,
            y: this.position.y + invader.y,
            width: this.width,
            height: this.height,
        };
    }
}

export default Invader;