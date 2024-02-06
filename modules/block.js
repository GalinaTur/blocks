export class Block {
    constructor(item, id) {
        this.id = id;
        this.width = item.width;
        this.height = item.height;
        this.smallestSide = Math.min(item.width, item.height)
    }
    rotate() {
        [this.width, this.height] = [this.height, this.width]
    }

    coords = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }

    createDOMElement = () => {
        const blockElement = document.createElement('DIV');
        blockElement.style.top = `${this.top}px`;
        blockElement.style.left = `${this.left}px`;
        blockElement.style.bottom = `${this.bottom}px`;
        blockElement.style.right = `${this.right}px`;
        blockElement.style.border = '1px solid rgba(0, 0, 0, 0.5)';
        blockElement.style.fontSize = "14px"
        blockElement.textContent = this.order;
        blockElement.classList.add(`block`);
        container.append(blockElement);
        return blockElement;
    }
}