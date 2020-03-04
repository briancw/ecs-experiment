const {makeNoise2D} = require('open-simplex-noise')
const {makeRectangle} = require('fractal-noise')

class GenerateMap {
    constructor() {
        this.mapData = []
        this.occupiedMap = []
    }

    createMap(seed, size) {
        this.seed = seed
        this.size = size
        this.mapSizeSquare = Math.pow(this.size, 2)
        this.seed1dNoise(seed)

        // Add Stones
        this.generateStone()

        // Add Trees
        const treeCount = 500
        this.generateTrees(treeCount)

        // Add colonists
        const colonistCount = 5
        this.generateColonists(colonistCount)
    }

    generateColonists(colonistCount) {
        for (let i = 0; i < colonistCount; i += 1) {
            let x = Math.floor(this.size / 2) + i
            let y = Math.floor(this.size / 2)
            this.mapData.push({type: 'colonist', x, y})
        }
    }

    generateStone() {
        const stoneFrequency = 0.06
        const stoneOctaves = 2
        const stoneNoise = this.getSimplex(stoneFrequency, stoneOctaves)

        for (let i = 0; i < stoneNoise.length; i += 1) {
            if (stoneNoise[i] > 0.7) {
                let [x, y] = this.iToXY(i)
                this.mapData.push({type: 'stone', x, y})
                this.occupiedMap[i] = true
            }
        }
    }

    // TODO consider generating trees with simplex noise instead of even distribution
    generateTrees(treeCount) {
        for (let i = 0; i < treeCount; i += 1) {
            let treeTileIndex = Math.floor(this.nextFloat() * this.mapSizeSquare)
            // Check if tile is already occupied
            if (!this.occupiedMap[treeTileIndex]) {
                let [x, y] = this.iToXY(treeTileIndex)
                this.mapData.push({type: 'tree', x, y})
                this.occupiedMap[treeTileIndex] = true
            }
        }
    }

    getSimplex(frequency, octaves) {
        const noise2D = makeNoise2D(this.seed)
        let opts = {
            frequency,
            octaves,
        }
        let noiseData2D = makeRectangle(this.size, this.size, noise2D, opts)
        let noiseData = this.twoDimensionToOne(noiseData2D)
        noiseData = this.normalizeZeroToOne(noiseData)
        return noiseData
    }

    twoDimensionToOne(data) {
        let newArray = []
        for (let iy = 0; iy < data.length; iy += 1) {
            let row = data[iy]
            for (let ix = 0; ix < row.length; ix += 1) {
                newArray.push(data[iy][ix])
            }
        }
        return newArray
    }

    normalizeZeroToOne(data) {
        let newArray = []
        let lowest = 100
        let highest = -100

        // Find the lowest and highest data points
        for (let i = 0; i < data.length; i += 1) {
            let cellValue = data[i]
            if (cellValue < lowest) {
                lowest = cellValue
            }
            if (cellValue > highest) {
                highest = cellValue
            }
        }

        // Go through data points and normalize so the minimum point is 0 and max is 1
        // Add the lowest value found to every number to bring everything to >= 0
        // Divide everything by the highest value found (plus the lowest since we added that to everything) to make every number <= 1
        for (let i = 0; i < data.length; i += 1) {
            newArray[i] = (data[i] + Math.abs(lowest)) / (highest + Math.abs(lowest))
        }

        return newArray
    }

    seed1dNoise(seed) {
        this.seed1d = seed % 2147483647
        if (this.seed1d <= 0) {
            this.seed1d += 2147483646
        }
    }

    next() {
        this.seed1d = this.seed1d * 16807 % 2147483647
        return this.seed1d
    }

    nextFloat() {
        return (this.next() - 1) / 2147483646
    }

    iToXY(i) {
        let x = Math.round(((i / this.size) % 1) * this.size)
        let y = Math.floor(i / this.size)
        return [x, y]
    }
}

module.exports = new GenerateMap()

/*
[
    {type: 'stone', x: 5, y: 5},
    {type: 'stone', x: 6, y: 5},
    {type: 'stone', x: 7, y: 5},
    {type: 'tree', x: 5, y: 8},
    {type: 'tree', x: 6, y: 8},
    {type: 'tree', x: 7, y: 8},
]
*/
