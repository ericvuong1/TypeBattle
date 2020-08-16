import { BoardState } from './typebattle-game'
export default class Player {
    hp: number
    name: string
    disabled: boolean
    isInvulnerable: boolean
    counterAttack: (() => null) | null // trigger a function


    constructor(hp: number, name: string) {
        this.hp = hp;
        this.name = name;
        this.disabled = false;
        this.isInvulnerable = false;
        this.counterAttack = null;
    }
}

