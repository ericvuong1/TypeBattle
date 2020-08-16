export default class Player {
    hp: number
    name: string
    disabled: boolean
    isBlocking: boolean

    constructor(hp: number, name: string) {
        this.hp = hp;
        this.name = name;
        this.disabled = false,
        this.isBlocking = false
    }
}

