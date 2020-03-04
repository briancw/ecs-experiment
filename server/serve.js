const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
// const {compressFile} = require('./brotlicompress')
const webPort = 3008
const webPortSecure = 3443

let privateKey
let certificate
if (process.argv.includes('--local')) {
    privateKey = fs.readFileSync(path.resolve(__dirname, 'certs/localcert.key'), 'utf8')
    certificate = fs.readFileSync(path.resolve(__dirname, 'certs/localcert.crt'), 'utf8')
} else {
    privateKey = fs.readFileSync(path.resolve(__dirname, 'certs/privkey.pem'), 'utf8')
    certificate = fs.readFileSync(path.resolve(__dirname, 'certs/fullchain.pem'), 'utf8')
}

const credentials = {key: privateKey, cert: certificate}
const app = express()

// Quick and dirty way to serve Brotli compressed JS files
if (process.env.NODE_ENV === 'production') {
    app.get('*.js', (req, res, next) => {
        req.url += '.br'
        res.set('Content-Encoding', 'br')
        res.set('Content-Type', 'application/javascript; charset=UTF-8')
        next()
    })
}

app.get('/list-saves', (req, res) => {
    const savePath = path.resolve(__dirname, '../public/saves/')
    const files = fs.readdirSync(savePath)
    res.json(files)
})

app.get('/new-save', (req, res) => {
    let seed = req.query.seed
    if (seed) {
        const {mapSize} = require('../config')
        const GenerateMap = require('./mapgenerator')

        GenerateMap.createMap(123456, mapSize)
        let mapJson = JSON.stringify(GenerateMap.mapData, null, 4)
        const mapPath = path.resolve(__dirname, '../public/saves/sample-map.json')
        fs.writeFileSync(mapPath, mapJson)
        res.send({success: true, message: 'map file saved'})

        // Also save map as a brotli compressed file
        // compressFile(mapPath)
        // .then(() => {
        //     res.send({success: true, message: 'map file saved'})
        // })
    } else {
        res.send({success: false, message: 'seed required'})
    }
})

app.use('/', express.static(path.resolve(__dirname, '../public')))

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

httpServer.listen(webPort, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`Serving HTTP on port ${webPort}`)
})

httpsServer.listen(webPortSecure, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`Serving HTTPS on port ${webPortSecure}`)
})
