export class Car {
    constructor(x, y, color, name) {
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 5;
        this.color = color;
        this.name = name;
        this.element = document.createElement("div");
        this.element.className = "car";
        this.element.style.backgroundColor = color;
        document.getElementById("world").appendChild(this.element);
        this.direction = 'right'; 
        this.updateRotation();
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    updateRotation() {
    let angle = 0;
    switch(this.direction) {
        case 'up': angle = -90; break;
        case 'down': angle = 90; break;
        case 'left': angle = 180; break;
        case 'right': angle = 0; break;
    }
    this.element.style.transform = `rotate(${angle}deg)`;
    }

    accelerate(direction) {
        this.direction = direction; 
        this.updateRotation();
        const force = 0.2;
        if (direction === "up") this.speedY -= force;
        if (direction === "down") this.speedY += force;
        if (direction === "left") this.speedX -= force;
        if (direction === "right") this.speedX += force;


        const speed = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
        if (speed > this.maxSpeed) {
            this.speedX = (this.speedX / speed) * this.maxSpeed;
            this.speedY = (this.speedY / speed) * this.maxSpeed;
        }
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.x = Math.max(0, Math.min(this.x, 5000 - 30));
        this.y = Math.max(0, Math.min(this.y, 5000 - 20));
        
        this.updatePosition();
    }
}