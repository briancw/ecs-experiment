import {System} from 'ecsy'

import {Position, Idle} from '../components/basic'
// import State from '../state'

export class MoveSystem extends System {
    execute() {
        this.queries.toMove.results.forEach((entity) => {
            let position = entity.getComponent(Position)
            let idle = entity.getComponent(Idle)

            if (idle) {
                position.x += Math.random()
                position.y += Math.random()
            }
        })
    }
}

MoveSystem.queries = {
    toMove: {
        components: [Position, Idle],
    },
}
