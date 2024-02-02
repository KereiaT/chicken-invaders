export class Enemy {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        };

        this.velocity = {
            x: 1,
            y: 0
        };

        this.currentFrame = 0;
        this.frameCount = 10;
        this.animationSpeed = 0.2;
        this.animationCounter = 0;
        this.width = 40;
        this.height = 45;

        this.initialize(); 
        this.enemySpriteImage = enemySpriteImage;
        
        this.animationCounter = 0;
        this.width = this.spriteFrameWidth; // Добавлено для установки ширины врага
        this.height = this.spriteFrameHeight;

        
        this.eggImage = eggImage;
        this.eggWidth = 30; // Уменьшенный размер яйца
        this.eggHeight = 30; // Уменьшенный размер яйца
        this.eggs = [];
    }
    async loadImage(src) {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = src;
            image.onload = () => resolve(image);
        });
    }

    async initialize() {
        this.enemySpriteImage = await this.loadImage('./assets/images/chickenRed.png');
        this.eggImage = await this.loadImage('./assets/images/Egg.webp');
    }

    draw(context) {
        if (this.enemySpriteImage && this.enemySpriteImage.complete) {
            context.drawImage(
                this.enemySpriteImage,
                this.currentFrame * this.spriteFrameWidth,
                0,
                this.spriteFrameWidth,
                this.spriteFrameHeight,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );

            this.eggs.forEach((egg) => {
                context.drawImage(this.eggImage, egg.x, egg.y, this.eggWidth, this.eggHeight);
            });
        }
    }


    shoot() {
        const egg = {
            x: this.position.x + this.width / 2 - this.eggWidth / 2,
            y: this.position.y + this.height,
            width: this.eggWidth,
            height: this.eggHeight
        };
        this.eggs.push(egg);
    }
    
    update() {
        this.animationCounter += this.animationSpeed;

        if (this.animationCounter >= 1) {
            this.animationCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }

        if (this.enemySpriteImage && this.enemySpriteImage.complete) {
            this.draw();

            this.position.x += this.velocity.x;
            if (this.position.x + this.width > canvas.width || this.position.x < 0) {
                this.velocity.x *= -1;
                this.position.y += this.height + 10;
            }

            if (Math.random() < 0.005) {
                this.shoot();
            }

            this.eggs.forEach((egg) => {
                egg.y += 2;
                // Если яйцо за границей поля, удаляем его
                if (egg.y > canvas.height) {
                    this.eggs.shift();
                }
            });
        }
    }
}
