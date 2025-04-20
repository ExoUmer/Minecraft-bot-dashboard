const socket = io();

const movementButtons = ['forward', 'back', 'left', 'right'];
const keyToDirection = {
    'w': 'forward',
    'a': 'left',
    's': 'back',
    'd': 'right',
    ' ': 'jump',
    'shift': 'sprint'
};

const pressedKeys = new Set();

// Set up mouse controls for on-screen buttons
movementButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    const start = () => {
        socket.emit('startMove', id);
        console.log(`Start moving ${id}`);
    };
    const stop = () => socket.emit('stopMove', id);

    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', stop);
    btn.addEventListener('mouseleave', stop);
});

// Set up keyboard controls
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const direction = keyToDirection[key];

    if (direction && !pressedKeys.has(key)) {
        pressedKeys.add(key);
        socket.emit('startMove', direction);
        console.log(`Start moving ${direction}`);
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const direction = keyToDirection[key];

    if (direction && pressedKeys.has(key)) {
        pressedKeys.delete(key);
        socket.emit('stopMove', direction);
        console.log(`Stop moving ${direction}`);
    }
});


// socket.on('health', (health) => {
//     const healthText = document.getElementById('healthText');
//     const healthValue = document.getElementById('healthValue');

//     if (health === null) {
//         healthText.textContent = 'Offline';
//         healthValue.style.width = '0%';
//         healthValue.style.backgroundColor = '#999';
//         console.log('Health is null:', health);
//     } else {
//         healthText.textContent = health;
//         healthValue.style.width = (health / 20 * 100) + '%';
//         healthValue.style.backgroundColor = '#4caf50';
//         console.log('Health is not null:', health);
//     }
// });

socket.on('botStatus', (status) => {
    if (!status) {
        document.getElementById('healthText').textContent = 'Offline';
        document.getElementById('hungerText').textContent = 'Offline';
        document.getElementById('xpText').textContent = 'Offline';
        document.getElementById('positionText').textContent = 'Offline';

        document.getElementById('healthValue').style.width = '0%';
        document.getElementById('hungerValue').style.width = '0%';
        document.getElementById('xpValue').style.width = '0%';
        return;
    }

    // Health
    document.getElementById('healthText').textContent = status.health;
    document.getElementById('healthValue').style.width = (status.health / 20 * 100) + '%';

    // Hunger
    document.getElementById('hungerText').textContent = status.hunger;
    document.getElementById('hungerValue').style.width = (status.hunger / 20 * 100) + '%';

    // xp
    document.getElementById('xpText').textContent = status.xp.level;
    document.getElementById('xpValue').style.width = (status.xp.progress * 100) + '%';

    // Position
    if (status.position) {
        document.getElementById('positionText').textContent =
            `X: ${status.position.x} | Y: ${status.position.y} | Z: ${status.position.z}`;
    }

    // Debugging or optional: show sprint/jump/onGround status
    console.log('Bot Status:', status);
});

