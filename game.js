// PACMAN Game - Complete Implementation
// Classic arcade game with authentic gameplay

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const TILE_SIZE = 16;
const COLS = 28;
const ROWS = 31;

const GAME_STATES = {
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    LEVEL_COMPLETE: 'levelComplete'
};

const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
    NONE: { x: 0, y: 0 }
};

const GHOST_MODES = {
    SCATTER: 'scatter',
    CHASE: 'chase',
    FRIGHTENED: 'frightened',
    EATEN: 'eaten'
};

// Classic Pacman Maze Layout
// 0 = path, 1 = wall, 2 = pellet, 3 = power pellet, 4 = ghost door
const MAZE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Sound Generator using Web Audio API
class SoundSystem {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.muted = false;
        this.sounds = {};
    }

    playTone(frequency, duration, type = 'square') {
        if (this.muted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    eatPellet() {
        this.playTone(400, 0.1);
    }

    eatPowerPellet() {
        this.playTone(200, 0.2);
        setTimeout(() => this.playTone(300, 0.2), 100);
    }

    eatGhost() {
        this.playTone(800, 0.1);
        setTimeout(() => this.playTone(1000, 0.1), 100);
        setTimeout(() => this.playTone(1200, 0.1), 200);
    }

    death() {
        const frequencies = [300, 250, 200, 150, 100, 75, 50];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15), i * 100);
        });
    }

    levelComplete() {
        const melody = [523, 587, 659, 698, 784, 880, 988, 1047];
        melody.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine'), i * 100);
        });
    }

    gameStart() {
        this.playTone(500, 0.3);
        setTimeout(() => this.playTone(600, 0.3), 300);
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}

// Pacman Character
class Pacman {
    constructor(x, y) {
        this.startX = x;
        this.startY = y;
        this.reset();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = DIRECTIONS.NONE;
        this.nextDirection = DIRECTIONS.NONE;
        this.speed = 2;
        this.mouthAngle = 0;
        this.mouthOpening = true;
        this.alive = true;
    }

    update(maze) {
        if (!this.alive) return;

        // Update mouth animation
        if (this.mouthOpening) {
            this.mouthAngle += 0.1;
            if (this.mouthAngle >= 0.7) this.mouthOpening = false;
        } else {
            this.mouthAngle -= 0.1;
            if (this.mouthAngle <= 0) this.mouthOpening = true;
        }

        // Try to change direction if requested
        if (this.canMove(this.nextDirection, maze)) {
            this.direction = this.nextDirection;
        }

        // Move in current direction
        if (this.canMove(this.direction, maze)) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;
        }

        // Wrap around tunnel
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
    }

    canMove(direction, maze) {
        const nextX = this.x + direction.x * this.speed;
        const nextY = this.y + direction.y * this.speed;

        const tileX = Math.floor(nextX / TILE_SIZE);
        const tileY = Math.floor(nextY / TILE_SIZE);

        if (tileY < 0 || tileY >= ROWS || tileX < 0 || tileX >= COLS) {
            return this.y === 14 * TILE_SIZE; // Allow tunnel
        }

        return maze[tileY][tileX] !== 1;
    }

    draw(ctx) {
        const angle = this.getAngle();
        const startAngle = angle + this.mouthAngle;
        const endAngle = angle - this.mouthAngle;

        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, TILE_SIZE / 2, startAngle, endAngle);
        ctx.lineTo(this.x, this.y);
        ctx.fill();
    }

    getAngle() {
        if (this.direction === DIRECTIONS.RIGHT) return 0;
        if (this.direction === DIRECTIONS.DOWN) return Math.PI / 2;
        if (this.direction === DIRECTIONS.LEFT) return Math.PI;
        if (this.direction === DIRECTIONS.UP) return Math.PI * 1.5;
        return 0;
    }

    getTilePosition() {
        return {
            x: Math.floor(this.x / TILE_SIZE),
            y: Math.floor(this.y / TILE_SIZE)
        };
    }
}

// Ghost AI
class Ghost {
    constructor(x, y, color, name, scatterTarget) {
        this.startX = x;
        this.startY = y;
        this.color = color;
        this.name = name;
        this.scatterTarget = scatterTarget;
        this.reset();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = DIRECTIONS.LEFT;
        this.mode = GHOST_MODES.SCATTER;
        this.speed = 1.5;
        this.frightenedTimer = 0;
        this.eatenTimer = 0;
    }

    update(maze, pacman, ghosts) {
        // Update timers
        if (this.mode === GHOST_MODES.FRIGHTENED) {
            this.frightenedTimer--;
            if (this.frightenedTimer <= 0) {
                this.mode = GHOST_MODES.SCATTER;
            }
        }

        if (this.mode === GHOST_MODES.EATEN) {
            this.eatenTimer--;
            if (this.eatenTimer <= 0) {
                this.mode = GHOST_MODES.SCATTER;
            }
        }

        // Determine target
        let target;
        if (this.mode === GHOST_MODES.EATEN) {
            target = { x: 13, y: 14 }; // Ghost house
        } else if (this.mode === GHOST_MODES.FRIGHTENED) {
            target = this.getRandomTarget();
        } else if (this.mode === GHOST_MODES.SCATTER) {
            target = this.scatterTarget;
        } else {
            target = this.getChaseTarget(pacman, ghosts);
        }

        // Move towards target
        this.moveTowardsTarget(target, maze);

        // Wrap around tunnel
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
    }

    getChaseTarget(pacman, ghosts) {
        const pacPos = pacman.getTilePosition();

        switch (this.name) {
            case 'blinky': // Red - Direct chase
                return pacPos;

            case 'pinky': // Pink - 4 tiles ahead of Pacman
                return {
                    x: pacPos.x + pacman.direction.x * 4,
                    y: pacPos.y + pacman.direction.y * 4
                };

            case 'inky': // Cyan - Complex pattern based on Blinky
                const blinky = ghosts.find(g => g.name === 'blinky');
                const blinkyPos = blinky.getTilePosition();
                const pivot = {
                    x: pacPos.x + pacman.direction.x * 2,
                    y: pacPos.y + pacman.direction.y * 2
                };
                return {
                    x: pivot.x + (pivot.x - blinkyPos.x),
                    y: pivot.y + (pivot.y - blinkyPos.y)
                };

            case 'clyde': // Orange - Chase if far, scatter if near
                const dist = this.distance(pacPos, this.getTilePosition());
                return dist > 8 ? pacPos : this.scatterTarget;

            default:
                return pacPos;
        }
    }

    moveTowardsTarget(target, maze) {
        const currentTile = this.getTilePosition();
        const possibleDirections = this.getPossibleDirections(maze);

        let bestDirection = this.direction;
        let shortestDistance = Infinity;

        for (const dir of possibleDirections) {
            const nextPos = {
                x: currentTile.x + dir.x,
                y: currentTile.y + dir.y
            };

            const dist = this.distance(nextPos, target);
            if (dist < shortestDistance) {
                shortestDistance = dist;
                bestDirection = dir;
            }
        }

        this.direction = bestDirection;
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
    }

    getPossibleDirections(maze) {
        const directions = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
        const opposite = this.getOppositeDirection();

        return directions.filter(dir => {
            if (dir === opposite) return false; // Don't reverse

            const nextX = this.x + dir.x * this.speed;
            const nextY = this.y + dir.y * this.speed;
            const tileX = Math.floor(nextX / TILE_SIZE);
            const tileY = Math.floor(nextY / TILE_SIZE);

            if (tileY < 0 || tileY >= ROWS || tileX < 0 || tileX >= COLS) {
                return this.y === 14 * TILE_SIZE;
            }

            return maze[tileY][tileX] !== 1;
        });
    }

    getOppositeDirection() {
        if (this.direction === DIRECTIONS.UP) return DIRECTIONS.DOWN;
        if (this.direction === DIRECTIONS.DOWN) return DIRECTIONS.UP;
        if (this.direction === DIRECTIONS.LEFT) return DIRECTIONS.RIGHT;
        if (this.direction === DIRECTIONS.RIGHT) return DIRECTIONS.LEFT;
        return DIRECTIONS.NONE;
    }

    getRandomTarget() {
        return {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        };
    }

    distance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    draw(ctx) {
        if (this.mode === GHOST_MODES.EATEN) {
            // Draw eyes only when eaten
            ctx.fillStyle = '#FFF';
            ctx.fillRect(this.x - 4, this.y - 2, 3, 3);
            ctx.fillRect(this.x + 1, this.y - 2, 3, 3);
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x - 3, this.y - 1, 2, 2);
            ctx.fillRect(this.x + 2, this.y - 1, 2, 2);
            return;
        }

        // Ghost body
        const radius = TILE_SIZE / 2;
        ctx.fillStyle = this.mode === GHOST_MODES.FRIGHTENED ? '#2121FF' : this.color;

        // Body
        ctx.beginPath();
        ctx.arc(this.x, this.y - radius / 2, radius, Math.PI, 0);
        ctx.lineTo(this.x + radius, this.y + radius);
        ctx.lineTo(this.x + radius / 2, this.y + radius / 2);
        ctx.lineTo(this.x, this.y + radius);
        ctx.lineTo(this.x - radius / 2, this.y + radius / 2);
        ctx.lineTo(this.x - radius, this.y + radius);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(this.x - 3, this.y - 2, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 3, this.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        if (this.mode !== GHOST_MODES.FRIGHTENED) {
            ctx.fillStyle = '#000';
            let pupilX = this.direction.x * 2;
            let pupilY = this.direction.y * 2;
            ctx.beginPath();
            ctx.arc(this.x - 3 + pupilX, this.y - 2 + pupilY, 1.5, 0, Math.PI * 2);
            ctx.arc(this.x + 3 + pupilX, this.y - 2 + pupilY, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    getTilePosition() {
        return {
            x: Math.floor(this.x / TILE_SIZE),
            y: Math.floor(this.y / TILE_SIZE)
        };
    }

    setFrightened(duration) {
        if (this.mode !== GHOST_MODES.EATEN) {
            this.mode = GHOST_MODES.FRIGHTENED;
            this.frightenedTimer = duration;
            this.speed = 1;
        }
    }

    setEaten() {
        this.mode = GHOST_MODES.EATEN;
        this.eatenTimer = 300;
        this.speed = 3;
    }

    setChase() {
        if (this.mode !== GHOST_MODES.EATEN && this.mode !== GHOST_MODES.FRIGHTENED) {
            this.mode = GHOST_MODES.CHASE;
            this.speed = 1.5;
        }
    }
}

// Main Game Class
class Game {
    constructor() {
        this.state = GAME_STATES.READY;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('pacmanHighScore')) || 0;
        this.level = 1;
        this.lives = 3;

        this.maze = JSON.parse(JSON.stringify(MAZE));
        this.sounds = new SoundSystem();

        // Initialize Pacman
        this.pacman = new Pacman(14 * TILE_SIZE, 23 * TILE_SIZE);

        // Initialize Ghosts
        this.ghosts = [
            new Ghost(13 * TILE_SIZE, 14 * TILE_SIZE, '#FF0000', 'blinky', { x: 25, y: 0 }),
            new Ghost(14 * TILE_SIZE, 14 * TILE_SIZE, '#FFB8FF', 'pinky', { x: 2, y: 0 }),
            new Ghost(12 * TILE_SIZE, 14 * TILE_SIZE, '#00FFFF', 'inky', { x: 27, y: 31 }),
            new Ghost(15 * TILE_SIZE, 14 * TILE_SIZE, '#FFB851', 'clyde', { x: 0, y: 31 })
        ];

        this.pelletCount = this.countPellets();
        this.ghostEatenScore = 200;
        this.modeTimer = 0;
        this.currentMode = 'scatter';
        this.readyTimer = 180;

        this.updateUI();
        this.setupControls();
        this.gameLoop();
    }

    countPellets() {
        let count = 0;
        for (let row of this.maze) {
            for (let cell of row) {
                if (cell === 2 || cell === 3) count++;
            }
        }
        return count;
    }

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.state === GAME_STATES.READY) {
                    this.start();
                } else if (this.state === GAME_STATES.GAME_OVER || this.state === GAME_STATES.LEVEL_COMPLETE) {
                    this.restart();
                }
            }

            if (this.state === GAME_STATES.PLAYING) {
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.pacman.nextDirection = DIRECTIONS.UP;
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.pacman.nextDirection = DIRECTIONS.DOWN;
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.pacman.nextDirection = DIRECTIONS.LEFT;
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.pacman.nextDirection = DIRECTIONS.RIGHT;
                        break;
                    case 'p':
                    case 'P':
                        this.togglePause();
                        break;
                }
            }
        });

        // Button controls
        document.getElementById('muteBtn').addEventListener('click', () => {
            const isMuted = this.sounds.toggleMute();
            document.getElementById('muteBtn').textContent = isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }

    start() {
        this.state = GAME_STATES.PLAYING;
        this.sounds.gameStart();
        this.hideOverlay();

        // Start ghosts in chase mode after a delay
        setTimeout(() => {
            this.ghosts.forEach(g => g.setChase());
        }, 3000);
    }

    restart() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.maze = JSON.parse(JSON.stringify(MAZE));
        this.pelletCount = this.countPellets();
        this.state = GAME_STATES.READY;
        this.readyTimer = 180;

        this.pacman.reset();
        this.ghosts.forEach(g => g.reset());

        this.updateUI();
        this.showOverlay('READY!');
    }

    togglePause() {
        if (this.state === GAME_STATES.PLAYING) {
            this.state = GAME_STATES.PAUSED;
            this.showOverlay('PAUSED');
            document.getElementById('pauseBtn').textContent = '▶ RESUME';
        } else if (this.state === GAME_STATES.PAUSED) {
            this.state = GAME_STATES.PLAYING;
            this.hideOverlay();
            document.getElementById('pauseBtn').textContent = '⏸ PAUSE';
        }
    }

    nextLevel() {
        this.level++;
        this.maze = JSON.parse(JSON.stringify(MAZE));
        this.pelletCount = this.countPellets();
        this.state = GAME_STATES.READY;
        this.readyTimer = 180;

        this.pacman.reset();
        this.ghosts.forEach(g => g.reset());

        // Increase difficulty
        this.pacman.speed = Math.min(2.5, 2 + this.level * 0.1);
        this.ghosts.forEach(g => g.speed = Math.min(2, 1.5 + this.level * 0.1));

        this.updateUI();
        this.showOverlay(`LEVEL ${this.level}`);

        setTimeout(() => {
            this.start();
        }, 2000);
    }

    loseLife() {
        this.lives--;
        this.updateUI();

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.state = GAME_STATES.READY;
            this.readyTimer = 180;
            this.pacman.reset();
            this.ghosts.forEach(g => g.reset());
            this.showOverlay('READY!');

            setTimeout(() => {
                this.start();
            }, 2000);
        }
    }

    gameOver() {
        this.state = GAME_STATES.GAME_OVER;
        this.sounds.death();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pacmanHighScore', this.highScore);
            this.updateUI();
            this.showOverlay('NEW HIGH SCORE!<br>Press SPACE to Restart');
        } else {
            this.showOverlay('GAME OVER<br>Press SPACE to Restart');
        }
    }

    update() {
        if (this.state !== GAME_STATES.PLAYING) {
            if (this.state === GAME_STATES.READY) {
                this.readyTimer--;
                if (this.readyTimer <= 0 && this.lives > 0) {
                    this.start();
                }
            }
            return;
        }

        // Update mode timer for ghost behavior switching
        this.modeTimer++;
        if (this.modeTimer % 600 === 0) {
            this.currentMode = this.currentMode === 'scatter' ? 'chase' : 'scatter';
            this.ghosts.forEach(g => {
                if (g.mode !== GHOST_MODES.FRIGHTENED && g.mode !== GHOST_MODES.EATEN) {
                    g.mode = this.currentMode === 'chase' ? GHOST_MODES.CHASE : GHOST_MODES.SCATTER;
                }
            });
        }

        // Update Pacman
        this.pacman.update(this.maze);

        // Check pellet collision
        const pacTile = this.pacman.getTilePosition();
        if (this.maze[pacTile.y] && this.maze[pacTile.y][pacTile.x] === 2) {
            this.maze[pacTile.y][pacTile.x] = 0;
            this.score += 10;
            this.pelletCount--;
            this.sounds.eatPellet();
            this.updateUI();

            if (this.pelletCount === 0) {
                this.sounds.levelComplete();
                this.state = GAME_STATES.LEVEL_COMPLETE;
                setTimeout(() => this.nextLevel(), 2000);
            }
        }

        // Check power pellet collision
        if (this.maze[pacTile.y] && this.maze[pacTile.y][pacTile.x] === 3) {
            this.maze[pacTile.y][pacTile.x] = 0;
            this.score += 50;
            this.pelletCount--;
            this.sounds.eatPowerPellet();
            this.ghostEatenScore = 200;
            this.ghosts.forEach(g => g.setFrightened(300));
            this.updateUI();
        }

        // Update ghosts
        this.ghosts.forEach(g => g.update(this.maze, this.pacman, this.ghosts));

        // Check ghost collision
        this.ghosts.forEach(ghost => {
            const dist = Math.hypot(this.pacman.x - ghost.x, this.pacman.y - ghost.y);
            if (dist < TILE_SIZE) {
                if (ghost.mode === GHOST_MODES.FRIGHTENED) {
                    this.score += this.ghostEatenScore;
                    this.ghostEatenScore *= 2;
                    this.sounds.eatGhost();
                    ghost.setEaten();
                    this.updateUI();
                } else if (ghost.mode !== GHOST_MODES.EATEN) {
                    this.pacman.alive = false;
                    setTimeout(() => this.loseLife(), 1000);
                }
            }
        });
    }

    draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw maze
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = this.maze[row][col];
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                if (cell === 1) {
                    // Wall
                    ctx.fillStyle = '#2121DE';
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = '#2121FF';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
                } else if (cell === 2) {
                    // Pellet
                    ctx.fillStyle = '#FFB897';
                    ctx.beginPath();
                    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (cell === 3) {
                    // Power pellet
                    ctx.fillStyle = '#FFB897';
                    ctx.beginPath();
                    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else if (cell === 4) {
                    // Ghost door
                    ctx.strokeStyle = '#FFB897';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y + TILE_SIZE / 2);
                    ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE / 2);
                    ctx.stroke();
                }
            }
        }

        // Draw ghosts
        this.ghosts.forEach(g => g.draw(ctx));

        // Draw Pacman
        if (this.pacman.alive) {
            this.pacman.draw(ctx);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
        document.getElementById('level').textContent = this.level;

        const livesContainer = document.getElementById('lives');
        livesContainer.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const life = document.createElement('div');
            life.className = 'life-icon';
            livesContainer.appendChild(life);
        }
    }

    showOverlay(message) {
        const overlay = document.getElementById('gameOverlay');
        const messageEl = document.getElementById('gameMessage');
        messageEl.innerHTML = message;
        overlay.classList.remove('hidden');
    }

    hideOverlay() {
        document.getElementById('gameOverlay').classList.add('hidden');
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new Game();
});
