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
        playerImage.src = './assets/images/ship.png';
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

class Enemy {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        };

        this.velocity = {
            x: 1,
            y: 0
        };

        const enemySpriteImage = new Image();
        enemySpriteImage.src = './assets/images/chickenRed.png';
        this.enemySpriteImage = enemySpriteImage;
        this.spriteFrameWidth = 40; // Замените на фактический размер кадра спрайта
        this.spriteFrameHeight = 45; // Замените на фактический размер кадра спрайта
        this.currentFrame = 0;
        this.frameCount = 10; // Общее количество кадров в анимации спрайта
        this.animationSpeed = 0.2; // Скорость анимации
        this.animationCounter = 0;
        this.width = this.spriteFrameWidth; // Добавлено для установки ширины врага
        this.height = this.spriteFrameHeight;

        const eggImage = new Image();
        eggImage.src = './assets/images/Egg.webp';
        this.eggImage = eggImage;
        this.eggWidth = 30; // Уменьшенный размер яйца
        this.eggHeight = 30; // Уменьшенный размер яйца
        this.eggs = [];
    }

    draw() {
        if (this.enemySpriteImage) {
            c.drawImage(
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
        }

        this.eggs.forEach((egg) => {
            c.drawImage(this.eggImage, egg.x, egg.y, this.eggWidth, this.eggHeight);
        });
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

        if (this.enemySpriteImage) {
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

const player = new Player();
const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
};


const enemies = [];

function initEnemies() {
    const enemyWidth = 40;
    const enemyHeight = 45;
    const enemiesPerRow = 30; // Количество врагов в ряду

    const paddingX = 10; // Расстояние между врагами по горизонтали
    const paddingY = 5; // Расстояние между врагами по вертикали

    for (let i = 0; i < enemiesPerRow; i++) {
        const x = i * (enemyWidth + paddingX);
        const y = 0; // Враги появляются в верхней части поля
        enemies.push(new Enemy(x, y));
    }
}

initEnemies();


function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();

    if (enemies) {
        enemies.forEach((enemy) => {
            enemy.update();
        });
        // Проверка столкновений яиц врагов с игроком
        player.projectiles.forEach((projectile) => {
            enemies.forEach((enemy) => {
                if (
                    enemy &&
                    projectile &&
                    projectile.x < enemy.position.x + enemy.width &&
                    projectile.x + projectile.width > enemy.position.x &&
                    projectile.y < enemy.position.y + enemy.height &&
                    projectile.y + projectile.height > enemy.position.y
                ) {
                    // Столкновение с врагом, обработайте его здесь (например, увеличение счета)
                    console.log('Выстрел попал во врага!');
                    // Удалите врага и выстрел из массивов
                    enemies.splice(enemies.indexOf(enemy), 1);
                    player.projectiles.splice(player.projectiles.indexOf(projectile), 1);
                }
            });
        });
    
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
};
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
            console.log('Выстрел!');
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
