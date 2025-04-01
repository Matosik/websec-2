export class Camera {
    constructor(target, worldElement, viewportElement) {
        this.target = target;
        this.world = worldElement;
        this.viewport = viewportElement;
        

        this.safeZone = {
            width: 0.1,  
            height: 0.1  
        };

        this.offsetX = 0;
        this.offsetY = 0;
    }

    update() {
        const viewportWidth = this.viewport.clientWidth;
        const viewportHeight = this.viewport.clientHeight;
        
        // Размеры безопасной зоны
        const safeWidth = viewportWidth * this.safeZone.width;
        const safeHeight = viewportHeight * this.safeZone.height;
        
        // Границы безопасной зоны
        const safeLeft = (viewportWidth - safeWidth) / 2;
        const safeRight = viewportWidth - safeLeft;
        const safeTop = (viewportHeight - safeHeight) / 2;
        const safeBottom = viewportHeight - safeTop;
        
        // Позиция цели относительно viewport (без учёта текущего смещения)
        const targetViewportX = this.target.x + this.offsetX;
        const targetViewportY = this.target.y + this.offsetY;
        
        // Проверяем, вышла ли цель за безопасную зону
        if (targetViewportX < safeLeft) {
            this.offsetX += safeLeft - targetViewportX;
        } else if (targetViewportX > safeRight) {
            this.offsetX += safeRight - targetViewportX;
        }
        
        if (targetViewportY < safeTop) {
            this.offsetY += safeTop - targetViewportY;
        } else if (targetViewportY > safeBottom) {
            this.offsetY += safeBottom - targetViewportY;
        }
        
        // Применяем смещение к миру
        this.world.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
    }
}