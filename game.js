import { Player } from './player.js';
import { Enemy } from './enemy.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const player = new Player(canvas);
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
    player.update(canvas);

    if (enemies) {
        enemies.forEach((enemy) => {
            enemy.update();
            enemy.draw(c); // передаем контекст рисования
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

export function showNewGameMenu() {
    menu.style.display = 'none';
    newGameMenu.style.display = 'block';
}
