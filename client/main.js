import './styles/index.less'

import {World, enableRemoteDevtools} from 'ecsy'
import State from './state'

// enableRemoteDevtools()

// Setup Canvas
const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')

State.width = window.innerWidth
State.height = window.innerHeight
State.ctx = ctx

canvas.width = State.width
canvas.height = State.height

import {Position, Renderable, Bio, Sprite, Idle} from './components/basic'

import {MoveSystem} from './systems/move'
import {RenderSystem} from './systems/render'

// Setup systems
var world = new World()
world
.registerSystem(RenderSystem)
.registerSystem(MoveSystem)

// Load a save file
import saveManager from './savemanager'
import {randomName} from './data/names'

saveManager.load('sample-map.json', (saveData) => {
    saveData.forEach(({type, x, y}) => {
        let entity = world.createEntity()
        entity.addComponent(Position, {x, y})
        entity.addComponent(Renderable)

        if (type === 'stone') {
            entity.addComponent(Sprite, {value: 'stone'})
        } else if (type === 'tree') {
            entity.addComponent(Sprite, {value: 'tree'})
        } else if (type === 'colonist') {
            entity.addComponent(Sprite, {value: 'colonist'})
            entity.addComponent(Idle)
        }
    })
})

// Run
let lastTime = performance.now()
function run() {
    // Compute delta and elapsed time
    let time = performance.now()
    let delta = time - lastTime

    // Run all the systems
    world.execute(delta, time)

    lastTime = time
    requestAnimationFrame(run)
}

run()
