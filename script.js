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
            down: false
        };

        const image = new Image();
        image.src = './assets/images/blue.png';
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        };
    }

    draw() {
        if (this.image) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    update() {
        if(this.image) {
         this.draw()
         this.position.x += this.velocity.x
         this.position.y += this.velocity.y
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
        }
     }
}

const player = new Player();
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();

    if (keys.a.pressed) {
        player.velocity.x = -5
    } else if (keys.d.pressed) {
        player.velocity.x = 5
    } else if (keys.w.pressed) {
        player.velocity.y = -5
    } else if (keys.s.pressed) {
        player.velocity.y = 5
    } else {
        player.velocity.x = 0
        player.velocity.y = 0
    }
}

animate();

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = true;
            console.log('left');
            break;
        case 'd':
            keys.d.pressed = true;
            console.log('right');
            break;
        case 'w':
            keys.w.pressed = true;
            console.log('up');
            break;
        case 's':
            keys.s.pressed = true;
            console.log('down');
            break;
        case ' ':
            keys.space.pressed = true;
            console.log('space');
            break;
    }
});

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false;
            console.log('left');
            break;
        case 'd':
            keys.d.pressed = false;
            console.log('right');
            break;
        case 's':
            keys.s.pressed = false;
            console.log('down');
            break;
        case 'w':
            keys.w.pressed = false;
            console.log('up');
            break;
        case ' ':
            keys.space.pressed = false;
            console.log('space');
            break;
    }
});

