export class Container {
    constructor(width, height) {
        this.width = width
        this.height = height

        //first void place - the whole container
        this.voidPlaces = [{
            width: width,
            height: height,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            isInternal: false,
        }]
    }

    createDOMElement = () => {
        const container = document.createElement("div");
        container.id = "container";
        container.style.width = `${container.width}px`;
        container.style.height = `${container.height}px`;
        document.body.append(container);
    }

    notPlacedBlocks = [];

    placedBlocks = [];

    sortVoidPlaces(arr) {
        arr.sort((place1, place2) => {
            return place1.left - place2.left;
        })

        arr.sort((place1, place2) => {
            return Number(place2.isInternal) - Number(place1.isInternal);
        })

        return arr
    }

    addVoidPlace(places) {
        this.voidPlaces.push(...places);
        this.sortVoidPlaces(this.voidPlaces);
    }

    removeVoidPlace(placeToRemove) {
        this.voidPlaces = this.voidPlaces.filter(place => place !== placeToRemove)
    }

    mergeVoidPlaces(place1, place2) {
        const newPlace = {
            width: place1.width + place2.width,
            height: place2.height,
            top: place2.top,
            right: place2.right,
            bottom: place2.bottom,
            left: place1.left,
            isInternal: false,
        }

        const internalPlace = {
            width: place1.width,
            height: place1.height - place2.height,
            top: place2.top + place2.height,
            right: place1.right,
            bottom: place1.bottom,
            left: place1.left,
            isInternal: true,
        }

        this.removeVoidPlace(place1);
        this.removeVoidPlace(place2);
        this.addVoidPlace([newPlace, internalPlace]);
        return newPlace;
    }

    splitVoidPlace(block, place) {
        this.removeVoidPlace(place);
        let place1, place2;

        place1 = {
            width: place.width - block.width,
            height: place.height,
            top: place.top,
            right: place.right,
            bottom: place.bottom,
            left: place.left + block.width,
            isInternal: place.isInternal,
        };

        place2 = {
            width: block.width,
            height: place.height - block.height,
            top: place.top,
            right: place.right + (place.width - block.width),
            bottom: place.bottom + block.height,
            left: place.left,
            isInternal: place.isInternal,
        };

        const isZeroArea = (place) => {
            return (place.width * place.height) === 0;
        }

        const placesToAdd = [];
        !isZeroArea(place1) && placesToAdd.push(place1);

        place2 && !isZeroArea(place2) && placesToAdd.push(place2);

        this.addVoidPlace(placesToAdd);
    }

    findSuitableVoidPlace = (block) => {

        let placeForOriginBlock = this.voidPlaces.find((place) => place.width >= block.width && place.height >= block.height);
        let placeForRotatedBlock = this.voidPlaces.find((place) => place.width >= block.height && place.height >= block.width);

        if (!placeForOriginBlock && !placeForRotatedBlock) {
            throw Error("Can't fit all the blocks in the container...");
        }

        if (placeForRotatedBlock.isInternal) {
            return {
                suitablePlace: placeForRotatedBlock,
                needRotate: true
            }
        }

        let voidPlaceToMerge = {};

        //moves block as left as possible by marging empty places
        do {
            voidPlaceToMerge = this.voidPlaces.find(item => {
                const itemRight = item.right;
                const placeRight = placeForOriginBlock?.right + placeForOriginBlock?.width;
                const itembottom = item.bottom;
                const placebottom = placeForOriginBlock?.bottom
                return itemRight === placeRight && itembottom < placebottom
            })

            if (voidPlaceToMerge) {
                placeForOriginBlock = this.mergeVoidPlaces(voidPlaceToMerge, placeForOriginBlock)
            }
        } while (voidPlaceToMerge)

        return placeForOriginBlock ? {
            suitablePlace: placeForOriginBlock,
            needRotate: false
        } : {
            suitablePlace: placeForRotatedBlock,
            needRotate: true
        }
    }
}