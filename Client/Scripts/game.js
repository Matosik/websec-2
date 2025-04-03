import { Car } from './car.js';
import { Star } from './star.js';
import { Camera } from './camera.js';
// DOM-элементы
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game-container");
const startButton = document.getElementById("start-button");
const playerNameInput = document.getElementById("player-name");
const carColorInput = document.getElementById("car-color");
const scoreElement = document.getElementById("score").querySelector("span");
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

// Игровые переменные
let playerCar, camera, stars = [], cars = [], score = 0;

// Запуск игры
startButton.addEventListener("click", () => {
    const playerName = playerNameInput.value || "Игрок 1";
    const carColor = carColorInput.value;

    menu.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    initGame(playerName, carColor);
});

function initGame(name, color) {
    playerCar = new Car(1500, 1500, color, name);
    cars.push(playerCar);

    camera = new Camera(playerCar, world, viewport);

    for (let i = 0; i < 15; i++) {
        stars.push(new Star());
    }

    gameLoop();
}

// Проверка сбора звёзд
function checkStarCollision() {
    stars.forEach((star, index) => {
        const dx = playerCar.x - star.x;
        const dy = playerCar.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 25) {
            world.removeChild(star.element);
            stars.splice(index, 1);
            stars.push(new Star());
            score++;
            scoreElement.textContent = score;
        }
    });
}

// Управление
const keysPressed = { up: false, down: false, left: false, right: false };

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") keysPressed.up = true;
    if (e.key === "ArrowDown" || e.key === "s") keysPressed.down = true;
    if (e.key === "ArrowLeft" || e.key === "a") keysPressed.left = true;
    if (e.key === "ArrowRight" || e.key === "d") keysPressed.right = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") keysPressed.up = false;
    if (e.key === "ArrowDown" || e.key === "s") keysPressed.down = false;
    if (e.key === "ArrowLeft" || e.key === "a") keysPressed.left = false;
    if (e.key === "ArrowRight" || e.key === "d") keysPressed.right = false;
});

// Игровой цикл
function gameLoop() {
    if (keysPressed.up) playerCar.accelerate("up");
    if (keysPressed.down) playerCar.accelerate("down");
    if (keysPressed.left) playerCar.accelerate("left");
    if (keysPressed.right) playerCar.accelerate("right");

    cars.forEach(car => car.move(cars));
    camera.update();
    checkStarCollision();

    requestAnimationFrame(gameLoop);
}