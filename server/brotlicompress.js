const fs = require('fs')
const zlib = require('zlib')

// eslint-disable-next-line require-jsdoc
async function compressFile(filename) {
    return new Promise((resolve, reject) => {
        const compress = zlib.createBrotliCompress()
        const input = fs.createReadStream(filename)
        const output = fs.createWriteStream(filename + '.br')

        input.pipe(compress).pipe(output)

        output.on('finish', () => {
            resolve()
        })
        output.on('error', (ex) => {
            reject(ex)
        })
    })
}

module.exports = {compressFile}
