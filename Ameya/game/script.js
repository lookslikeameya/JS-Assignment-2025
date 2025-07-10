class Player {
    constructor(game) {
        this.game = game;
        this.width = 140;
        this.height = 120;
        this.x = this.game.width * .5 - this.width * 0.5;
        this.y = this.game.height - this.height;
        this.speed = 3;
        this.image1 = document.getElementById('player');
        this.image2 = document.getElementById('jets');

    }

    render(context) {

        context.drawImage(this.image1, 1 * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        context.drawImage(this.image2, 1 * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        if (this.game.keys.indexOf('ArrowLeft') > -1) { this.x -= this.speed }
        if (this.game.keys.indexOf('ArrowRight') > -1) { this.x += this.speed }

        if (this.x < -this.width * .5) { this.x = -this.width * .5 }
        else if (this.x > this.game.width - this.width * .5) { this.x = this.game.width - this.width * .5 }
    }
    shoot() {
        const projectile = this.game.getProjectile();
        if (projectile) { projectile.start(this.x + (this.width * .5), this.y); }
    }
    restart() {
        this.x = this.game.width * .5 - this.width * 0.5;
        this.y = this.game.height - this.height;

    }
}
class Projectile {
    constructor() {
        this.width = 10;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.speed = 10;
        this.free = true;//means in this pool

    }

    render(context) {
        context.save();
        if (!this.free) {
            context.fillStyle = 'orange';
            context.fillRect(this.x, this.y, this.width, this.height);
            this.y -= this.speed;
            if (this.y < 0 - this.height) { this.reset() }
        }
        context.restore();
    }
    start(x, y) {
        this.x = x;
        this.y = y;
        this.free = false;
    }
    reset() {
        this.free = true;
    }

}
class Enemy {
    constructor(game, positionX, positionY) {
        this.game = game;
        this.width = this.game.enemySize;
        this.height = this.game.enemySize;
        this.x = 0;
        this.y = 0;
        this.positionX = positionX;
        this.positionY = positionY;
        this.enemydestroyed = false;
        this.image = document.getElementById('beetle');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);
        this.maxFrame = 2;
        this.frameTimer = 0;
        this.frameInterval = 10;
        this.isHit = false;  
    }

    render(context, x, y) {
        context.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.x = x + this.positionX;
        this.y = y + this.positionY;

        
        if (this.isHit) {
            this.frameTimer++;
            if (this.frameTimer >= this.frameInterval) {
                this.frameX++;
                this.frameTimer = 0;
                if (this.frameX > this.maxFrame) {
                    this.enemydestroyed = true;
                }
            }
        }

        
        for (let i = 0; i < this.game.numberofprojectiles; i++) {
            if (!this.game.projectilesPool[i].free && this.game.checkcollision(this.game.projectilesPool[i], this)) {
                this.game.projectilesPool[i].reset();
                if (!this.game.gameOver) {
                    this.game.score += 1;
                }
                this.isHit = true; 
            }
        }

       
        if (this.game.checkcollision(this.game.player, this)) {
            this.enemydestroyed = true;
            this.game.gameOver = true;
        }
    }
}


class Wave {
    constructor(game) {
        this.game = game;
        this.width = this.game.columns * this.game.enemySize;
        this.height = this.game.rows * this.game.enemySize;
        this.x = 0;
        this.y = -this.height;
        this.speedX = 2;
        this.speedY = 0;
        this.enemies = [];
        this.create();
    }
    render(context) {
        if (this.y < 0) { this.y += 5; }
        this.speedY = 0;


        if (this.x < 0 || this.x > this.game.width - this.width) {
            this.speedX *= -1;
            this.speedY = this.game.enemySize;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.enemies = this.enemies.filter(enemy => !enemy.enemydestroyed);
        for (let i = 0; i < this.enemies.length; i++) {

            this.enemies[i].render(context, this.x, this.y);





        }

    }
    create() {
        for (let y = 0; y < this.game.rows; y++) {
            for (let x = 0; x < this.game.columns; x++) {
                this.posX = x * this.game.enemySize;
                this.posY = y * this.game.enemySize;
                this.enemies.push(new Enemy(this.game, this.posX, this.posY))
            }
        }
    }
}
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.keys = [];
        this.player = new Player(this);

        this.projectilesPool = [];
        this.numberofprojectiles = 10;
        this.createProjectiles();

        this.columns = 3;
        this.rows = 3;
        this.enemySize = 80;

        this.waves = [];
        this.waves.push(new Wave(this));

        this.score = 0;
        this.gameOver = false;


        window.addEventListener('keydown', e => {
            if (this.keys.indexOf(e.key) == -1) { this.keys.push(e.key) }
            if (e.key === 'r' && this.gameOver) { this.restart() }
            if (e.key === 'Enter') { this.player.shoot() }
        })
        window.addEventListener('keyup', e => {
            if (this.keys.indexOf(e.key) > -1) { this.keys.splice(this.keys.indexOf(e.key), 1) }

        })

    }
    render(context) {

        this.text(context);
        this.player.render(context)

        for (let i = 0; i < this.numberofprojectiles; i++) {


            this.projectilesPool[i].render(context);

        }

        this.waves[this.waves.length - 1].render(context);
        if (this.waves[this.waves.length - 1].enemies.length < 1) { this.newWave(); }




    }
    createProjectiles() {
        for (let i = 0; i < this.numberofprojectiles; i++) {
            this.projectilesPool.push(new Projectile())
        }
    }
    getProjectile() {
        for (let i = 0; i < this.numberofprojectiles; i++) {
            if (this.projectilesPool[i].free) {
                return this.projectilesPool[i];

            }
        }
    }
    checkcollision(a, b) {
        if (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y


        ) {

            return true;

        }

    }
    text(context) {
        context.save();
        context.fillText('Score: ' + this.score, 20, 40);
        if (this.gameOver) {
            context.textAlign = 'center';
            context.font = '100px impact';
            context.fillText('GAME OVER', this.width * .5, this.height * .5);
            context.font = '20px impact';
            context.fillText('PRESS R TO RESTART', this.width * .5, this.height * .5 + 30);
        }
        context.restore();
    }
    newWave() {
        if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * .8) {
            this.columns++;
        }
        else if (this.rows * this.enemySize < this.height * .6) {
            this.rows++;
        }
        this.waves.push(new Wave(this));
    }
    restart() {
        this.player.restart();
        this.columns = 3;
        this.rows = 3;

        this.waves = [];
        this.waves.push(new Wave(this));

        this.score = 0;
        this.gameOver = false;
    }

}

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 800;
    ctx.fillStyle = 'white';

    ctx.lineWidth = 5;
    ctx.font = '30px Impact';
    const game = new Game(canvas);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);

        requestAnimationFrame(animate);
    }

    animate();
})
