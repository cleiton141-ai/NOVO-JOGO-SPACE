import Player from "./classes/Player.js";
import Invader from "./classes/Invader.js";
import Laser from "./classes/Laser.js";
import Barrier from "./classes/Barrier.js";
import Starfield from "./classes/Starfield.js";




 const canvas = document.querySelector("canvas");
 const ctx = canvas.getContext("2d");

 canvas.width = innerWidth;
 canvas.height = innerHeight;
 const starfield = new Starfield(canvas.width, canvas.height);

 ctx.imageSmoothingEnabled = false;

 const player = new Player(canvas.width, canvas.height);
 const invader = new Invader(canvas.width);
 const playerLasers = [];
 const invaderLasers = [];
 const gameOverScreen = document.querySelector("#game-over");
 const restartButton = document.querySelector("#restart-button");
 let gameOver = false;
 const barriers = [
     new Barrier(canvas.width * 0.2, canvas.height * 0.62, 180, 18),
     new Barrier(canvas.width * 0.65, canvas.height * 0.62, 180, 18),
 ];
 let nextInvaderShotAt = 0;
 let touchStartX = 0;
 let touchMoved = false;

 const keys = {
    left: false,
    right: false,

 };

 const resizeGame = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    starfield.resize(canvas.width, canvas.height);
    if (invader.setResponsiveMode(canvas.width)) {
        invader.resetFormation(false);
    }
    player.position.x = Math.max(
        0,
        Math.min(player.position.x, canvas.width - player.width)
    );
    player.position.y = canvas.height - player.height - 30;
    barriers[0].position.x = canvas.width * 0.2;
    barriers[0].position.y = canvas.height * 0.62;
    barriers[1].position.x = canvas.width * 0.65;
    barriers[1].position.y = canvas.height * 0.62;
 };

 const hasCollision = (first, second) => (
    first.position.x < second.x + second.width &&
    first.position.x + first.width > second.x &&
    first.position.y < second.y + second.height &&
    first.position.y + first.height > second.y
 );

 const shootPlayerLaser = () => {
    if (!player.isAlive) {
        return;
    }

    playerLasers.push(new Laser(
        player.position.x + player.width / 2 - 2.5,
        player.position.y,
        0,
        -8,
        "#55e7ff"
    ));
 };

 const movePlayerTo = (clientX) => {
    const canvasBounds = canvas.getBoundingClientRect();
    const canvasX = (clientX - canvasBounds.left) * (canvas.width / canvasBounds.width);
    const nextX = canvasX - player.width / 2;
    const previousX = player.position.x;

    player.position.x = Math.max(
        0,
        Math.min(nextX, canvas.width - player.width)
    );

    if (player.position.x < previousX) {
        player.targetRotation = -Math.PI / 4;
    } else if (player.position.x > previousX) {
        player.targetRotation = Math.PI / 4;
    }
 };

 const shootInvaderLaser = (timestamp) => {
    const aliveInvaders = invader.getAliveInvaders();

    if (timestamp < nextInvaderShotAt || aliveInvaders.length === 0) {
        return;
    }

    const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
    const shooterBounds = invader.getBounds(shooter);
    const startX = shooterBounds.x + shooterBounds.width / 2;
    const startY = shooterBounds.y + shooterBounds.height;
    const targetX = player.position.x + player.width / 2;
    const targetY = player.position.y + player.height / 2;
    const distance = Math.hypot(targetX - startX, targetY - startY) || 1;
    const speed = 5;
    const velocityX = invader.isMobile
        ? 0
        : ((targetX - startX) / distance) * speed;
    const velocityY = invader.isMobile
        ? speed
        : ((targetY - startY) / distance) * speed;

    invaderLasers.push(new Laser(
        startX - 2.5,
        startY,
        velocityX,
        velocityY,
        "#ff5470"
    ));
    nextInvaderShotAt = timestamp + 1000 + Math.random() * 2000;
 };

 const updateLasers = (lasers) => {
    for (const laser of lasers) {
        laser.update();
    }
 };

 const drawLasers = (lasers) => {
    for (const laser of lasers) {
        laser.draw(ctx);
    }
 };

 const drawBarriers = () => {
    if (invader.isMobile) {
        return;
    }

    for (const barrier of barriers) {
        barrier.draw(ctx);
    }
 };

 const resetRound = () => {
     player.reset(canvas.width, canvas.height);
     invader.resetFormation(false);
     playerLasers.length = 0;
     invaderLasers.length = 0;
     nextInvaderShotAt = 0;
     gameOver = false;
     gameOverScreen.hidden = true;
 };

 const showGameOver = () => {
     gameOver = true;
     player.isAlive = false;
     gameOverScreen.hidden = false;
 };

 const removeOutsideLasers = (lasers) => {
    for (let index = lasers.length - 1; index >= 0; index -= 1) {
        if (lasers[index].isOutside(canvas)) {
            lasers.splice(index, 1);
        }
    }
 };

 const laserHitsBarrier = (laser) => barriers.some((barrier) => hasCollision(laser, {
    x: barrier.position.x,
    y: barrier.position.y,
    width: barrier.width,
    height: barrier.height,
 }));

 const removeLasersBlockedByBarriers = (lasers) => {
    if (invader.isMobile) {
        return;
    }

    for (let index = lasers.length - 1; index >= 0; index -= 1) {
        if (laserHitsBarrier(lasers[index])) {
            lasers.splice(index, 1);
        }
    }
 };

 const handleCollisions = () => {
    for (let laserIndex = playerLasers.length - 1; laserIndex >= 0; laserIndex -= 1) {
        const laser = playerLasers[laserIndex];

        for (const target of invader.getAliveInvaders()) {
            if (hasCollision(laser, invader.getBounds(target))) {
                target.alive = false;
                playerLasers.splice(laserIndex, 1);
                break;
            }
        }
    }

    const playerBounds = {
        x: player.position.x,
        y: player.position.y,
        width: player.width,
        height: player.height,
    };

    for (let laserIndex = invaderLasers.length - 1; laserIndex >= 0; laserIndex -= 1) {
        if (hasCollision(invaderLasers[laserIndex], playerBounds)) {
            invaderLasers.splice(laserIndex, 1);
            showGameOver();
            break;
        }
    }
 };

 const gameLoop = (timestamp = 0) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starfield.update();
    starfield.draw(ctx);

    if (gameOver) {
        player.draw(ctx);
        invader.draw(ctx);
        drawBarriers();
        window.requestAnimationFrame(gameLoop);
        return;
    }

    if (keys.left && player.position.x >= 0) {
        player.moveleft();
    };

    
    if (keys.right && player.position.x <= canvas.width - player.width) {
        player.moveRight();
    };

    invader.update(canvas.width);
    shootInvaderLaser(timestamp);
    updateLasers(playerLasers);
    updateLasers(invaderLasers);
    removeLasersBlockedByBarriers(playerLasers);
    removeLasersBlockedByBarriers(invaderLasers);
    handleCollisions();

    if (invader.isCleared()) {
        invader.resetFormation(true);
        playerLasers.length = 0;
        invaderLasers.length = 0;
    }

    removeOutsideLasers(playerLasers);
    removeOutsideLasers(invaderLasers);

    player.draw(ctx);
    invader.draw(ctx);
    drawBarriers();
    drawLasers(playerLasers);
    drawLasers(invaderLasers);

    window.requestAnimationFrame(gameLoop);
 };

 gameLoop();

 addEventListener("resize", resizeGame);

 restartButton.addEventListener("click", resetRound);

 canvas.addEventListener("pointerdown", (event) => {
    if (gameOver) {
        return;
    }

    touchStartX = event.clientX;
    touchMoved = false;
    canvas.setPointerCapture(event.pointerId);
 });

 canvas.addEventListener("pointermove", (event) => {
    if (!canvas.hasPointerCapture(event.pointerId) || gameOver) {
        return;
    }

    if (Math.abs(event.clientX - touchStartX) > 8) {
        touchMoved = true;
    }

    movePlayerTo(event.clientX);
 });

 canvas.addEventListener("pointerup", (event) => {
    if (!canvas.hasPointerCapture(event.pointerId)) {
        return;
    }

    if (!touchMoved) {
        shootPlayerLaser();
    } else {
        player.stopMoving();
    }

    canvas.releasePointerCapture(event.pointerId);
 });

 canvas.addEventListener("pointercancel", (event) => {
    if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
    }
    player.stopMoving();
 });

  addEventListener("keydown", (event) =>{
    const key = event.key.toLowerCase();

    if (key === "a") {
        keys.left = true;
    }
    
    if (key === "d") {
        keys.right = true;
    }

    if (key === "w") {
        shootPlayerLaser();
    }
 });




 addEventListener("keyup", (event) =>{
    const key = event.key.toLowerCase();

    if (key === "a") {
        keys.left = false;
    }
    
    if (key === "d") {
        keys.right = false;
    }

    if (!keys.left && !keys.right) {
        player.stopMoving();
    }
 });

