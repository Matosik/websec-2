// Класс машинки
export class Car {
    constructor(x, y, color, name) {
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 6;
        this.acceleration = 0.3;
        this.friction = 0.95;
        this.color = color;
        this.name = name;

        // Создание SVG-элемента машинки
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.element.setAttribute("width", "40");
        this.element.setAttribute("height", "20");
        this.element.classList.add("car");
        this.element.innerHTML = `
            <rect x="0" y="0" width="40" height="20" fill="${color}" rx="5"/>
            <rect x="5" y="3" width="10" height="14" fill="#fff"/>
            <rect x="25" y="3" width="10" height="14" fill="#fff"/>
        `;
        document.getElementById("world").appendChild(this.element);
        this.updatePosition();
    }


    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }


    updateRotation() {
        if (Math.abs(this.speedX) > 0.1 || Math.abs(this.speedY) > 0.1) {
            const angle = Math.atan2(this.speedY, this.speedX) * (180 / Math.PI);
            this.element.style.transform = `rotate(${angle}deg)`;
        }
    }


    accelerate(direction) {
        if (direction === "up") this.speedY -= this.acceleration;
        if (direction === "down") this.speedY += this.acceleration;
        if (direction === "left") this.speedX -= this.acceleration;
        if (direction === "right") this.speedX += this.acceleration;


        const speed = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
        if (speed > this.maxSpeed) {
            this.speedX = (this.speedX / speed) * this.maxSpeed;
            this.speedY = (this.speedY / speed) * this.maxSpeed;
        }
    }


    move(cars) {
        this.speedX *= this.friction;
        this.speedY *= this.friction;

        this.x += this.speedX;
        this.y += this.speedY;


        const worldWidth = 5000, worldHeight = 5000;
        if (this.x < 0) {
            this.speedX = -this.speedX * 0.5;
            this.x = 0;
        } else if (this.x > worldWidth - 40) {
            this.speedX = -this.speedX * 0.5;
            this.x = worldWidth - 40;
        }
        if (this.y < 0) {
            this.speedY = -this.speedY * 0.5;
            this.y = 0;
        } else if (this.y > worldHeight - 20) {
            this.speedY = -this.speedY * 0.5;
            this.y = worldHeight - 20;
        }

        cars.forEach(otherCar => {
            if (otherCar !== this && this.isCollidingWith(otherCar)) {
                const tempSpeedX = this.speedX;
                const tempSpeedY = this.speedY;
                this.speedX = otherCar.speedX * 0.5;
                this.speedY = otherCar.speedY * 0.5;
                otherCar.speedX = tempSpeedX * 0.5;
                otherCar.speedY = tempSpeedY * 0.5;


                const dx = this.x - otherCar.x;
                const dy = this.y - otherCar.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const overlap = 40 - distance;
                if (distance > 0) {
                    this.x += (dx / distance) * overlap * 0.5;
                    this.y += (dy / distance) * overlap * 0.5;
                    otherCar.x -= (dx / distance) * overlap * 0.5;
                    otherCar.y -= (dy / distance) * overlap * 0.5;
                }
            }
        });

        this.updatePosition();
        this.updateRotation();
    }

    isCollidingWith(otherCar) {
        const rect1 = { left: this.x, right: this.x + 40, top: this.y, bottom: this.y + 20 };
        const rect2 = { left: otherCar.x, right: otherCar.x + 40, top: otherCar.y, bottom: otherCar.y + 20 };
        return rect1.left < rect2.right && rect1.right > rect2.left &&
               rect1.top < rect2.bottom && rect1.bottom > rect2.top;
    }
}