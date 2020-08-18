/**
 * WELCOME TO MY GOD CLASS
 */
import Player from './player';
import socketio from 'socket.io';

// const spells: Spell[] = require('spells.json')['spells'];
import { spells } from './spells.json';

export type Spell = {
  name: string
  damage: number
  selfDamage: number
  delayTimeDamage: number
  cooldownTime: number
  stunTime: number
  invulnerabilityTime: number
  overtimeDamage: number
  overTimeDamageDuration: number,
  counterAttackSpell: string | null
}

type PlayerString = "Player1" | "Player2"
export type BoardState = {
  "Player1": Player,
  "Player2": Player
}

export default class TypeBattleGame {
  _players: socketio.Socket[]
  _turns: number[] | null[]
  player1: Player
  player2: Player
  boardState: BoardState

  constructor(p1: socketio.Socket, p2: socketio.Socket) {
    this._players = [p1, p2];
    this._turns = [null, null];
    this.player1 = new Player(100, 'Player1');
    this.player2 = new Player(100, 'Player2');

    this.boardState = {
      Player1: this.player1,
      Player2: this.player2,
    }

    this._sendToPlayers('Battle Starts!');

    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
    });
  }

  otherPlayer(player: PlayerString): PlayerString {
    if (player == 'Player1') {
      return 'Player2';
    } else {
      return 'Player1';
    }
  }

  /**
   * Attempts to attack player, could trigger various conditions and inflict damage to attacker
   * depending on the current status of the attacked player.
   * @param attackedPlayer 
   * @param damage 
   */

  _attemptAttackPlayer(attackedPlayer: PlayerString, spell: Spell) {
    const damage = spell['damage'];
    const selfDamage = spell['selfDamage']
    const currentPlayer = this.otherPlayer(attackedPlayer);

    // If attacking a player that is blocking, trigger their counter attack 
    if (this.boardState[attackedPlayer].isInvulnerable) {
      // Calling counter attack
      // TODO: Do counter attack properly
      console.log("Counter Attacking!");
      const counterSpell = this.boardState[attackedPlayer]['counterAttackSpell']
      if (counterSpell !== undefined) {
        this._processSpell(attackedPlayer, counterSpell);
      }
    }
    else {
      this.boardState[attackedPlayer]['hp'] -= damage;
      this.boardState[currentPlayer]['hp'] -= selfDamage;
    }
    this._updateStateToPlayers();
  }
  _updateGameState(currentPlayer: PlayerString, msg: string) {
    const spell: Spell | undefined = spells.find((s: Spell) => s["name"] === msg);
    spell && this._processSpell(currentPlayer, spell);
  }

  /**
   * For now, invulnerability means disabling users input
   * @param player 
   * @param invincible 
   */
  _setInvulnerable(player: PlayerString, invincible: boolean) {
    this.boardState[player]['isInvulnerable'] = invincible;
    invincible ? this._disableInput(player) : this._enableInput(player);
  }

  _processSpell(attacker: PlayerString, spell: Spell): void {
    let attacked = this.otherPlayer(attacker);;
    const damage = spell['damage'];
    const selfDamage = spell["selfDamage"];
    const delayTimeDamage = spell["delayTimeDamage"];
    const cooldownTime = spell["cooldownTime"];
    const stunTime = spell["stunTime"];
    const invulnerabilityTime = spell["invulnerabilityTime"];
    const overtimeDamage = spell["overtimeDamage"];
    const overTimeDamageDuration = spell["overTimeDamageDuration"];
    let counterAttackSpellString = spell["counterAttackSpell"];
    let counterAttackSpell: Spell | undefined = undefined;
    if (counterAttackSpellString !== undefined) {
      counterAttackSpell = spells.find((s: Spell) => s['name'] === counterAttackSpellString);
    }
    this.boardState[attacker]['counterAttackSpell'] = counterAttackSpell;

    // TODO: manage cooldowns?

    // Disable players in invulnerability mode
    if (invulnerabilityTime > 0) {
      this._setInvulnerable(attacker, true)
      setTimeout(() => {
        this._setInvulnerable(attacker, false);
        this._updateStateToPlayers();
        this._checkGameOver();
      }, invulnerabilityTime);
    }

    // Damage will be delayed
    if (delayTimeDamage > 0) {
      this._disableInput(attacker);
      setTimeout(() => {
        this._enableInput(attacker);
        this._attemptAttackPlayer(attacked, spell);
      }, delayTimeDamage);
    }
    this._updateStateToPlayers();

    // TODO: move away from this switch case statement
    // switch (spell['name']) {
    //   case 'Quick Attack':
    //     console.log('Attacking');
    //     this._attemptAttackPlayer(otherPlayer, spell);
    //     break;
    //   case 'Block':
    //     // set player flag to isBlocking
    //     this.boardState[currentPlayer].isInvulnerable = true;
    //     this._updateStateToPlayers();
    //     this._disableInput(currentPlayer);
    //     setTimeout(() => {
    //       this._enableInput(currentPlayer);
    //       this.boardState[currentPlayer].isInvulnerable = false;
    //       this._updateStateToPlayers();
    //     }, 2000);
    //     break;
    //   default:
    //     break;
    // }
  }

  update(text: string) {
    let textSplit = text.split(": ");
    if (textSplit[0] === 'Player1' || textSplit[0] === 'Player2') {
      const attacker: PlayerString = textSplit[0];
      const msg: string = textSplit[1];
      this._updateGameState(attacker, msg);
    }
  }

  _updateStateToPlayers() {
    this._players.forEach((player) => {
      player.emit('state', this.boardState);
    });
    this._checkGameOver();
  }

  _sendToPlayer(playerIndex: number, msg: string) {
    msg = `Player ${playerIndex + 1}: ${msg}`
    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg: string) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }

  _onTurn(playerIndex: number, turn: number) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `You selected ${turn}`);

    this._checkGameOver();
  }

  _checkGameOver() {
    let endGame = (winner: socketio.Socket, loser: socketio.Socket) => {
      this._disableInput('Player1');
      this._disableInput('Player2');
      this._updateStateToPlayers();
      this._sendWinMessage(winner, loser);
    }

    if (this.boardState['Player1']['hp'] <= 0) {
      let winner = this._players[1];
      let loser = this._players[0];
      endGame(winner, loser);
    } else if (this.boardState['Player2']['hp'] <= 0) {
      let winner = this._players[0];
      let loser = this._players[1];
      endGame(winner, loser);
    }
  }

  _disableInput(player: PlayerString) {
    this.boardState[player]['disabled'] = true;
  }

  _enableInput(player: PlayerString) {
    this.boardState[player]['disabled'] = false;
  }

  _sendWinMessage(winner: socketio.Socket, loser: socketio.Socket) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

}
