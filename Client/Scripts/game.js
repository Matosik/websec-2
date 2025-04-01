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

// Игровые объекты
let playerCar;
let stars = [];
let score = 0;
let camera;

// Запуск игры
startButton.addEventListener("click", () => {
    const playerName = playerNameInput.value || "Игрок 1";
    const carColor = carColorInput.value;

    menu.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    initGame(playerName, carColor);
});


function initGame(name, color) {

    playerCar = new Car(Math.random() * 4000, Math.random() * 4000, color, name);
    
    camera = new Camera(playerCar, world, viewport);
    
    for (let i = 0; i < 20; i++) {
        stars.push(new Star());
    }
    
    // Запускаем игровой цикл
    gameLoop();
}

// Проверка сбора звёзд
function checkStarCollision() {
    stars.forEach((star, index) => {
        const dx = playerCar.x - star.x;
        const dy = playerCar.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30) {
            world.removeChild(star.element);
            stars.splice(index, 1);
            stars.push(new Star());
            score++;
            scoreElement.textContent = score;
        }
    });
}

// Управление
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") playerCar.accelerate("up");
    if (e.key === "ArrowDown" || e.key === "s") playerCar.accelerate("down");
    if (e.key === "ArrowLeft" || e.key === "a") playerCar.accelerate("left");
    if (e.key === "ArrowRight" || e.key === "d") playerCar.accelerate("right");
});

// Игровой цикл
function gameLoop() {
    playerCar.move();
    camera.update();
    checkStarCollision();
    requestAnimationFrame(gameLoop);
}