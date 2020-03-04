import {TagComponent} from 'ecsy'

export class Position {
    constructor() {
        this.x = 0
        this.y = 0
    }
}

export class Bio {
    constructor() {
        this.gender = ''
        this.first = ''
        this.last = ''
    }
}

export class Sprite {
    constructor() {
        this.value = ''
    }
}

export class Idle extends TagComponent {}
export class Renderable extends TagComponent {}
