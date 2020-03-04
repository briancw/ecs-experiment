import {System} from 'ecsy'
import {Position, Renderable, Sprite} from '../components/basic'
import State from '../state'

const spriteSize = 5

export class RenderSystem extends System {
    execute() {
        State.ctx.clearRect(0, 0, State.width, State.height)

        this.queries.renderables.results.forEach((entity) => {
            let position = entity.getComponent(Position)
            let sprite = entity.getComponent(Sprite).value

            this.drawThing(position, sprite)
        })
    }

    drawThing(position, sprite) {
        if (sprite === 'colonist') {
            State.ctx.fillStyle = '#000000'
        } else if (sprite === 'tree') {
            State.ctx.fillStyle = '#00ff00'
        } else if (sprite === 'stone') {
            State.ctx.fillStyle = '#62707F'
        } else {
            State.ctx.fillStyle = '#ff69b4'
        }

        State.ctx.fillRect(position.x * spriteSize, position.y * spriteSize, spriteSize, spriteSize)
    }
}

RenderSystem.queries = {
    renderables: {components: [Renderable]},
}
