import { Spell } from './typebattle-game'
export default class Player {
    hp: number
    name: string
    disabled: boolean
    isInvulnerable: boolean
    counterAttackSpell: CounterSpell | undefined 

    constructor(hp: number, name: string) {
        this.hp = hp;
        this.name = name;
        this.disabled = false;
        this.isInvulnerable = false;
        this.counterAttackSpell = undefined;
    }
}

export class CounterSpell {
    priority: number
    spell: Spell

    constructor(priority: number, spell: Spell) {
        this.priority = priority;
        this.spell = spell;
    }
}

