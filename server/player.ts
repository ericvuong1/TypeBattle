import { Spell } from './typebattle-game'
export default class Player {
    hp: number
    name: string
    disabled: boolean
    isInvulnerable: boolean
    counterAttackSpell: Spell | undefined 
    enableTime: number | undefined

    constructor(hp: number, name: string) {
        this.hp = hp;
        this.name = name;
        this.disabled = false;
        this.isInvulnerable = false;
        this.counterAttackSpell = undefined;
        this.enableTime = undefined
    }
}

