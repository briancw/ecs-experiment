const {app, BrowserWindow} = require('electron')
const path = require('path')

const express = require('express')

const webApp = express()
webApp.use('/', express.static(path.resolve(__dirname, './public')))

webApp.listen(3008)

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // webPreferences: {
        //     nodeIntegration: true,
        // },
    })

    mainWindow.loadURL('http://localhost:3008/')

    mainWindow.openDevTools({
        mode: 'undocked',
        // mode: 'bottom',
        activate: true,
    })
})

app.on('window-all-closed', function() {
    // if (process.platform !== 'darwin')
    app.quit()
})
