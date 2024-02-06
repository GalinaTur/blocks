
export class Algorithm {

    process(blocks, container) {
        container.notPlacedBlocks = [...blocks];

        this.allocateBlocks(blocks, container);

        const fullness = this.calculateFullness(container);
        return {
            fullness: fullness,
            blockCoordinates: this.blockCoordinates,
        }
    }

    blockCoordinates = [];

    placeBlock (block, voidPlace, container) {
            const bottom = voidPlace.bottom;
            const top = container.height - (bottom + block.height);
            const left = voidPlace.left;
            const right = container.width - (left + block.width);

            this.blockCoordinates.push({ top, right, bottom, left, initialOrder: block.id });
            container.placedBlocks.push(block);

            const blockIndex = container.notPlacedBlocks.findIndex((item) => block.id === item.id);
            if (blockIndex !== -1) container.notPlacedBlocks.splice(blockIndex, 1);
        }

    allocateBlocks(blocks, container) {
        let smallestSide = Infinity;
        const smallestBlock = container.notPlacedBlocks.reduce((blockWithSmallestSide, block) => {
            if (block.smallestSide < smallestSide) {
                smallestSide = block.smallestSide;
                return block;
            } else {
                return blockWithSmallestSide;
            }
        }, {})

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            
            let { suitablePlace, needRotate } = container.findSuitableVoidPlace(block);
            if (needRotate) block.rotate()
            
            this.placeBlock(block, suitablePlace, container);
            container.splitVoidPlace(block, suitablePlace, smallestBlock);
        };
    }

    calculateFullness = (container) => {
        const blocksArea = container.placedBlocks.reduce((totalArea, block) => {
            totalArea += block.width * block.height;
            return totalArea
        }, 0)

        const internalArea = container.voidPlaces.filter(item => item.isInternal).reduce((totalArea, place) => {
            totalArea += place.width * place.height;
            return totalArea
        }, 0)

        const fullness = 1 - (internalArea / (internalArea + blocksArea))
        return fullness
    }
}