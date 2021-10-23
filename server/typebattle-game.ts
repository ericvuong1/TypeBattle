/**
 * WELCOME TO MY GOD CLASS
 */
import Player from './player';
import socketio from 'socket.io';

// const spells: Spell[] = require('spells.json')['spells'];
import { spells } from './spells.json';
import { count } from 'console';

// logger stuff
import {attackLogger, gameLogger} from "./logging/config"

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

  _attemptAttackPlayer(attackedPlayer: PlayerString, spell: Spell): void {
    const { damage, selfDamage } = spell
    const currentPlayer = this.otherPlayer(attackedPlayer);

    // If attacking a player that is blocking, trigger their counter attack
    if (this.boardState[attackedPlayer].isInvulnerable) {
      // Calling counter attack
      // TODO: Do counter attack properly
      attackLogger.info("Counter Attacking!");
      const counterSpell = this.boardState[attackedPlayer]['counterAttackSpell']
      if (counterSpell === undefined) {
        console.log("No counter spell found!")
        return;
      }
      console.log(`Counter spell is ${JSON.stringify(counterSpell)}`)
      this._processSpell(attackedPlayer, counterSpell);
    }
    else {
      this.boardState[attackedPlayer]['hp'] -= damage;
      this.boardState[currentPlayer]['hp'] -= selfDamage;
    }
    this._updateStateToPlayersAndCheckGameOver();
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
    attackLogger.info(`Processing spell for attack=${attacker}, spell=${JSON.stringify(spell)}`)
    let attacked = this.otherPlayer(attacker);
    let { damage,
      selfDamage,
      delayTimeDamage,
      cooldownTime,
      stunTime,
      invulnerabilityTime,
      overtimeDamage,
      overTimeDamageDuration,
      counterAttackSpell
    } = spell
    let actualCounterAttackSpell: Spell | undefined = undefined;
    if (counterAttackSpell !== undefined) {
      actualCounterAttackSpell = spells.find((s: Spell) => s['name'] === counterAttackSpell);
    }
    this.boardState[attacker]['counterAttackSpell'] = actualCounterAttackSpell;

    // TODO: manage cooldowns?

    // Disable players in invulnerability mode
    if (invulnerabilityTime > 0) {
      this._setInvulnerable(attacker, true)
      setTimeout(() => {
        this._setInvulnerable(attacker, false);
        this._updateStateToPlayersAndCheckGameOver();
        this._checkGameOver();
      }, invulnerabilityTime);
    }

    // Damage will be delayed
    if (delayTimeDamage > 0) {
      this._disableInput(attacker);
      setTimeout(() => {
        this._enableInput(attacker);
        this._attemptAttackPlayer(attacked, spell);
        this._updateStateToPlayersAndCheckGameOver();
      }, delayTimeDamage);
    }
    // TODO: This doesn't work\
    // START
    if (stunTime > 0) {
      this._disableInput(attacker);
      setTimeout(() => {
        attackLogger.info(`Re-enabling player=${attacker}'s input`)
        this._enableInput(attacker);
        this._updateStateToPlayersAndCheckGameOver();
      }, stunTime);
    }
    // END

    this._updateStateToPlayersAndCheckGameOver();
  }

  update(text: string) {
    let textSplit = text.split(": ");
    if (textSplit[0] === 'Player1' || textSplit[0] === 'Player2') {
      const attacker: PlayerString = textSplit[0];
      const msg: string = textSplit[1];
      this._updateGameState(attacker, msg);
    }
  }

  _updateStateToPlayersAndCheckGameOver() {
    this._players.forEach((player) => {
      player.emit('state', this.boardState);
    });
    this._checkGameOver();
  }

  _updateStateToPlayers() {
    this._players.forEach((player) => {
      player.emit('state', this.boardState);
    });
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
    attackLogger.info(`Disabling ${player}'s input`)
    this.boardState[player]['disabled'] = true;
  }

  _enableInput(player: PlayerString) {
    attackLogger.info(`Enabling ${player}'s input`)
    this.boardState[player]['disabled'] = false;
  }

  _sendWinMessage(winner: socketio.Socket, loser: socketio.Socket) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

}
