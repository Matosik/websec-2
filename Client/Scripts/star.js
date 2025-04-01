export class Star {
    constructor() {
        this.x = Math.random() * 5000;
        this.y = Math.random() * 5000;
        this.element = document.createElement("div");
        this.element.className = "star";
        document.getElementById("world").appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}