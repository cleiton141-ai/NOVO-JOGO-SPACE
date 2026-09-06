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
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;

    }

    moveleft() {
        this.position.x -= this.velocity;

    }

     moveRight() {
        this.position.x += this.velocity;

    }

    draw(ctx) {
        if (this.image.complete && this.image.naturalWidth > 0) {
            ctx.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }

        if (this.engineImage.complete && this.engineImage.naturalWidth > 0) {
            ctx.drawImage(
                this.engineImage,
                this.position.x,
                this.position.y + 9,
                this.width,
                this.height
            );
        }

         if (this.engineSprites.complete && this.engineSprites.naturalWidth > 0) {
            ctx.drawImage(
                this.engineSprites,
                this.position.x,
                this.position.y + 9,
                this.width,
                this.height
            );
        }
    }
}

export default Player;