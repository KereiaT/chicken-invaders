const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {
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

        const playerImage = new Image();
        playerImage.src = './assets/images/blue.png';
        playerImage.onload = () => {
            const scale = 0.5;
            this.image = playerImage;
            this.width = playerImage.width * scale;
            this.height = playerImage.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        };

        const projectileImage = new Image();
        projectileImage.src = './assets/images/b1.png';
        this.projectileImage = projectileImage;

        this.projectiles = [];
    }

    draw() {
        if (this.image) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }

        this.projectiles.forEach((projectile) => {
            c.drawImage(this.projectileImage, projectile.x, projectile.y, projectile.width, projectile.height);
        });
    }

    update() {
        if (this.image) {
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
                projectile.y -= 5; // Измените скорость выстрела по вашему желанию
                if (projectile.y < 0) {
                    // Удалите снаряд, если он вышел за пределы холста
                    this.projectiles.shift();
                }
            });
        }
    }

    shoot() {
        // Создайте новый снаряд и добавьте его в массив снарядов
        const projectile = {
            x: this.position.x + this.width / 2 - this.projectileImage.width / 2,
            y: this.position.y,
            width: this.projectileImage.width,
            height: this.projectileImage.height
        };

        this.projectiles.push(projectile);
    }
}

const player = new Player();
const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
};

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();

    if (keys.left) {
        player.velocity.x = -5;
    } else if (keys.right) {
        player.velocity.x = 5;
    } else {
        player.velocity.x = 0;
    }

    if (keys.up) {
        player.velocity.y = -5;
    } else if (keys.down) {
        player.velocity.y = 5;
    } else {
        player.velocity.y = 0;
    }
}

animate();

addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'ArrowUp':
            keys.up = true;
            break;
        case 'ArrowDown':
            keys.down = true;
            break;
        case ' ':
            keys.space = true;
            player.shoot(); 
            break;
    }
});

addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowDown':
            keys.down = false;
            break;
        case 'ArrowUp':
            keys.up = false;
            break;
        case ' ':
            keys.space = false;
            break;
    }
});