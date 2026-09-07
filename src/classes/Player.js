import { PATH_ENGINE_IMAGE, PATH_SPACESHIP_IMAGE, PATH_SPRITES_IMAGE } from "../utils/constants.js";


class Player {
    constructor(canvaswidth, canvasheight) {
        this.width = 60 ;
        this.height = 60 ;
        this.velocity = 6;

        this.position = {
            x: canvaswidth / 2 - this.width / 2,
            y: canvasheight - this.height - 30,
        };

        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(PATH_SPRITES_IMAGE);
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.frameDelay = 6;
        this.frameCount = 6;
        this.rotation = 0;
        this.targetRotation = 0;
        this.isAlive = true;

    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;

    }

    moveleft() {
        this.position.x -= this.velocity;
        this.targetRotation = -Math.PI / 4;

    }

     moveRight() {
        this.position.x += this.velocity;
        this.targetRotation = Math.PI / 4;

    }

    stopMoving() {
        this.targetRotation = 0;
    }

    reset(canvaswidth, canvasheight) {
        this.position.x = canvaswidth / 2 - this.width / 2;
        this.position.y = canvasheight - this.height - 30;
        this.rotation = 0;
        this.targetRotation = 0;
        this.isAlive = true;
    }

    draw(ctx) {
        if (!this.isAlive) {
            return;
        }

        this.rotation += (this.targetRotation - this.rotation) * 0.2;

        this.frameTimer += 1;

        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        }

        ctx.save();
        ctx.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
        ctx.rotate(this.rotation);

        if (this.image.complete && this.image.naturalWidth > 0) {
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        }

        if (this.engineImage.complete && this.engineImage.naturalWidth > 0) {
            ctx.drawImage(
                this.engineImage,
                -this.width / 2,
                -this.height / 2 + 9,
                this.width,
                this.height
            );
        }

         if (this.engineSprites.complete && this.engineSprites.naturalWidth > 0) {
            ctx.drawImage(
                this.engineSprites,
                this.frameIndex * this.width,
                0,
                this.width,
                this.height,
                -this.width / 2,
                -this.height / 2 + 9,
                this.width,
                this.height
            );
        }

        ctx.restore();
    }
}

export default Player;