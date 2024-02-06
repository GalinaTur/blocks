import { View } from "./modules/view.js";
import { Algorithm } from "./modules/algorithm.js";
import { Block } from "./modules/block.js";
import { Container } from "./modules/container.js";

const sortBlocksByWidthSize = (blocks) => {
    return blocks.sort((block1, block2) => block2.width - block1.width);
}

const formatData = (blocks) => {
    const blocksWithID = blocks.map((item, id) => {
        const block = new Block(item, id);
        if (block.height > block.width) block.rotate();
        return block;
    })

    const sortedBlocks = sortBlocksByWidthSize(blocksWithID);;
    return sortedBlocks;
}

await fetch("./data.json")
    .then(res => res.json())
    .then(data => {
        const init = () => {
            const view = new View();

            const container = {
                width: window.innerWidth - 10,
                height: window.innerHeight - 10
            }
            const mainContainer = new Container(container.width, container.height);
            
            try {
                // container size equal to viewport size with some margins
                const algorithm = new Algorithm();
                const { fullness, blockCoordinates } = algorithm.process(formatData(data), mainContainer);
                view.render(mainContainer, blockCoordinates, fullness);
            } catch (e) {
                view.renderError(mainContainer, e.message);
            }
        }

        init()

        window.addEventListener("resize", init);
    })







