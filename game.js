const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const TILE_SIZE = 20;
let score = 0;

// 1 = Wall, 0 = Pellet, 2 = Empty
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let player = {
    x: 1, y: 1,
    pixelX: 30, pixelY: 30,
    dir: {x: 0, y: 0},
    nextDir: {x: 0, y: 0},
    speed: 2
};

let ghost = {
    pixelX: 300, pixelY: 150,
    speed: 1.2
};

function canMove(gx, gy) {
    return map[gy] && map[gy][gx] !== 1;
}

function update() {
    // Determine grid position
    if ((player.pixelX - 10) % TILE_SIZE === 0 && (player.pixelY - 10) % TILE_SIZE === 0) {
        player.x = (player.pixelX - 10) / TILE_SIZE;
        player.y = (player.pixelY - 10) / TILE_SIZE;

        // Eat Pellet
        if (map[player.y][player.x] === 0) {
            map[player.y][player.x] = 2;
            score += 10;
            scoreElement.innerText = score;
        }

        // Change Direction
        if (canMove(player.x + player.nextDir.x, player.y + player.nextDir.y)) {
            player.dir = player.nextDir;
        }
        // Wall Collision
        if (!canMove(player.x + player.dir.x, player.y + player.dir.y)) {
            player.dir = {x: 0, y: 0};
        }
    }

    player.pixelX += player.dir.x * player.speed;
    player.pixelY += player.dir.y * player.speed;

    // Simple Ghost AI
    if (ghost.pixelX < player.pixelX) ghost.pixelX += ghost.speed;
    else ghost.pixelX -= ghost.speed;
    if (ghost.pixelY < player.pixelY) ghost.pixelY += ghost.speed;
    else ghost.pixelY -= ghost.speed;

    // Game Over Collision
    if (Math.hypot(player.pixelX - ghost.pixelX, player.pixelY - ghost.pixelY) < 15) {
        alert("Game Over! Score: " + score);
        location.reload();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Maze
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 1) {
                ctx.fillStyle = "#1919a6";
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[r][c] === 0) {
                ctx.fillStyle = "#ffb8ae";
                ctx.beginPath();
                ctx.arc(c * TILE_SIZE + 10, r * TILE_SIZE + 10, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Draw Pac-Man
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(player.pixelX, player.pixelY, 8, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(player.pixelX, player.pixelY);
    ctx.fill();

    // Draw Ghost
    ctx.fillStyle = "red";
    ctx.fillRect(ghost.pixelX - 8, ghost.pixelY - 8, 16, 16);

    update();
    requestAnimationFrame(draw);
}

window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") player.nextDir = {x: 0, y: -1};
    if (e.key === "ArrowDown") player.nextDir = {x: 0, y: 1};
    if (e.key === "ArrowLeft") player.nextDir = {x: -1, y: 0};
    if (e.key === "ArrowRight") player.nextDir = {x: 1, y: 0};
});

draw();