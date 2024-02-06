
//size - color list map list for keeping one color for one size
const blockColorsList = new Map();

export class View {

    //render container and blocks
    render(container, blocks, fullness) {
        document.body.innerHTML = '';
        this.renderContainer(container, fullness);
        this.renderBlocks(blocks, container);
    }

    //render error window
    renderError(container, err) {
        document.body.innerHTML = '';
        this.renderContainer(container, null);
        this.renderErrorMessage(err)
    }

    //color randomizer for blocks
    getRandomColor() {
        const chars = "0123456789ABCDEF";
        let colorCode = "#";

        for (let i = 0; i < 6; i++) {
            colorCode += chars[Math.floor(Math.random() * 16)];
        }

        return colorCode;
    }

    //set block color and record it to Map, or if Map already has it - get it
    setBlockColor(largestSide, smallestSide) {
        const sizeKey = `${largestSide}x${smallestSide}`;

        if (blockColorsList.has(sizeKey)) {
            return blockColorsList.get(sizeKey);
        }

        let blockColor = this.getRandomColor();
        blockColorsList.set(sizeKey, blockColor);
        return blockColor;
    }

    renderContainer(container, fullness) {
        const containerElement = document.createElement("div");
        containerElement.id = "container";
        containerElement.style.width = `${container.width}px`;
        containerElement.style.height = `${container.height}px`;

        if (fullness) {
        const fullnessElement = document.createElement("p");
        fullnessElement.id = "fullness";
        fullnessElement.textContent = `Fullness: ${Math.round(fullness * 1000) / 10}%`;
        containerElement.append(fullnessElement);
        }

        document.body.append(containerElement);
    }

    renderBlocks(blocks, container) {
        const containerElement = document.getElementById("container");

        blocks.map((item) => {
            const blockSmallestSize = Math.min(container.width - item.right - item.left, container.height - item.top - item.bottom)
            const blockLargestSize = Math.max(container.width - item.right - item.left, container.height - item.top - item.bottom)
            const blockElement = document.createElement('DIV');

            blockElement.style.top = `${item.top}px`;
            blockElement.style.left = `${item.left}px`;
            blockElement.style.bottom = `${item.bottom}px`;
            blockElement.style.right = `${item.right}px`;
            blockElement.classList.add(`block-${item.initialOrder}`);
            blockElement.style.fontSize = `${Math.max(blockSmallestSize / 3, 12)}px`;
            blockElement.textContent = item.initialOrder;
            blockElement.style.backgroundColor = this.setBlockColor(blockLargestSize, blockSmallestSize);

            containerElement.append(blockElement);
        })
    }

    renderErrorMessage(err) {
        const containerElement = document.getElementById("container");

        const errorMessage = document.createElement("div");
        errorMessage.id = "error";
        errorMessage.textContent = err;

        containerElement.append(errorMessage);
    }
};
