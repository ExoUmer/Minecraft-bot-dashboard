//The nullish coalescing (??) operator is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
// The optional chaining (?.) operator accesses an object's property or calls a function. If the object accessed or function called using this operator is undefined or null, the expression short circuits and evaluates to undefined instead of throwing an error.
const mineflayer = require('mineflayer');

let bot;

function createBot(socket) {
    bot = mineflayer.createBot({
        host: '192.168.0.100',
        port: 44693,
        username: 'uk00',
        version: '1.8.9',
    });

    let statsInterval;
    let lastStatus = {};

    bot.on('spawn', () => {
        console.log('Bot spawned');

        //This will send object only with changes values
        // statsInterval = setInterval(() => {
        //     const currentStatus = {
        //         health: bot.health ?? null,
        //         hunger: bot.food ?? null,
        //         xp: {
        //             level: bot.experience.level,
        //             progress: bot.experience.progress,
        //         },
        //         position: bot.entity?.position ? {
        //             x: Number(bot.entity.position.x.toFixed(2)),
        //             y: Number(bot.entity.position.y.toFixed(2)),
        //             z: Number(bot.entity.position.z.toFixed(2))
        //         } : null,
        //         isSprinting: bot.getControlState('sprint'),
        //         isJumping: bot.getControlState('jump'),
        //         isOnGround: bot.entity?.onGround ?? null
        //     };
        
        //     const changedStatus = {};
        
        //     for (const key in currentStatus) {
        //         const newVal = currentStatus[key];
        //         const oldVal = lastStatus[key];
        
        //         // Handle deep comparison for nested objects like 'xp' and 'position'
        //         if (typeof newVal === 'object' && newVal !== null) {
        //             if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        //                 changedStatus[key] = newVal;
        //             }
        //         } else {
        //             if (newVal !== oldVal) {
        //                 changedStatus[key] = newVal;
        //             }
        //         }
        //     }
        
        //     if (Object.keys(changedStatus).length > 0) {
        //         socket.emit('botStatusUpdate', changedStatus);
        //         lastStatus = currentStatus;
        //         console.log('Sent changed bot status:', changedStatus);
        //     }
        // }, 500);

        //This will send whole bot status object even if one thing changes
        statsInterval = setInterval(() => {
            const currentStatus = {
                health: bot.health ?? null,
                hunger: bot.food ?? null,
                xp: {
                    level: bot.experience.level,
                    progress: bot.experience.progress,
                },
                position: bot.entity?.position ? {
                    x: Number(bot.entity.position.x.toFixed(2)),
                    y: Number(bot.entity.position.y.toFixed(2)),
                    z: Number(bot.entity.position.z.toFixed(2))
                } : null,
                isSprinting: bot.getControlState('sprint'),
                isJumping: bot.getControlState('jump'),
                isOnGround: bot.entity?.onGround ?? null
            };

            // Compare with previous status
            if (JSON.stringify(currentStatus) !== JSON.stringify(lastStatus)) {
                socket.emit('botStatus', currentStatus);
                lastStatus = currentStatus;
                console.log('Sent updated bot status:', currentStatus);
            }
        }, 500);

        socket.on('startMove', (direction) => {
            if (bot) {
                bot.setControlState(direction, true);
                console.log(`Start moving ${direction}`);
            }
        });

        socket.on('stopMove', (direction) => {
            if (bot) {
                bot.setControlState(direction, false);
                console.log(`Stop moving ${direction}`);
            }
        });
    });

    bot.on('end', () => {
        console.log('Bot disconnected');
        clearInterval(statsInterval);
        socket.emit('botStatus', null);
    });
}

function destroyBot() {
    if (bot) {
        console.log('Destroying bot...');
        bot.quit();
        bot = null;
    }
}

module.exports = { createBot, destroyBot };
