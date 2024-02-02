export class Player {
    constructor(canvas) {
        this.canvas = canvas; 
        this.velocity = {
            x: 0,
            y: 0
        };

        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false
        };

        this.width = 0;
        this.height = 0;
        this.position = {
            x: 0,
            y: 0
        };

        this.projectiles = [];
        this.initialize();
    }
        async loadImage(src) {
            return new Promise((resolve) => {
                const image = new Image();
                image.src = src;
                image.onload = () => resolve(image);
            });
        }
    
        async initialize() {
            this.image = await this.loadImage('./assets/images/ship.png');
            this.projectileImage = await this.loadImage('./assets/images/b1.png');
    
            const scale = 0.5;
            this.width = this.image.width * scale;
            this.height = this.image.height * scale;
            this.position = {
                x: this.canvas.width / 2 - this.width / 2,
                y: this.canvas.height - this.height - 20
            };
        }

    draw(context) {
        if (!context || !this.image || !this.image.complete) {
            return;
        }

        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        this.projectiles.forEach((projectile) => {
            context.drawImage(this.projectileImage, projectile.x, projectile.y, projectile.width, projectile.height);
        });
    }

    update(canvas) {
        if (this.image && this.image.complete) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
    
            if (this.position.x < 0) {
                this.position.x = 0;
            }
    
            if (this.position.x + this.width > canvas.width) {
                this.position.x = canvas.width - this.width;
            }
    
            if (this.position.y < 0) {
                this.position.y = 0;
            }
    
            if (this.position.y + this.height > canvas.height) {
                this.position.y = canvas.height - this.height;
            }
    
            if (this.keys.space) {
                this.shoot();
            }
    
            this.projectiles.forEach((projectile) => {
                projectile.y -= 5;
                if (projectile.y < 0) {
                    this.projectiles.shift();
                }
            });
        }
    }
    

    shoot() {
        if (this.projectileImage.width && this.projectileImage.height) {
            const projectile = {
                x: this.position.x + this.width / 2 - this.projectileImage.width / 2,
                y: this.position.y,
                width: this.projectileImage.width,
                height: this.projectileImage.height
            };
            this.projectiles.push(projectile);
        }
    }
}
