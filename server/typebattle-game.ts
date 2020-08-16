import Player from './player';
import socketio from 'socket.io';

// const spells: Spell[] = require('spells.json')['spells'];
import { spells } from './spells.json';

interface Spell {
  name: string
  damage: number
  selfDamage: number
  delayTimeDamage: number
  cooldownTime: number
  stunTime: number
  invulnerabilityTime: number
  overtimeDamage: number
  overTimeDamageDuration: number
}

type PlayerString = "Player1" | "Player2"

export default class TypeBattleGame {
  _players: socketio.Socket[]
  _turns: number[] | null[]
  player1: Player
  player2: Player
  currentState: {
    "Player1": Player,
    "Player2": Player
  }

  constructor(p1: socketio.Socket, p2: socketio.Socket) {
    this._players = [p1, p2];
    this._turns = [null, null];
    this.player1 = new Player(100, 'Player1');
    this.player2 = new Player(100, 'Player2');

    this.currentState = {
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

  _attackPlayer(attackedPlayer: PlayerString, damage: number) {
      let currentPlayer = this.otherPlayer(attackedPlayer);

      // If attacking a player that is blocking, get stunned
      if (this.currentState[attackedPlayer].isBlocking) {
        this._disableInput(currentPlayer)
        this._updateStateToPlayers();

        setTimeout(() => {
          this._enableInput(currentPlayer);
          this._updateStateToPlayers();
        }, 3000);

      }
      else {
        this.currentState[attackedPlayer]['hp'] = this.currentState[attackedPlayer]['hp'] - damage;
      }
  }
  _updateGameState(currentPlayer: PlayerString, msg: string) {
    const spell: Spell | undefined = spells.find((s: Spell) => s['name'] === msg);
    const updatedBoard = spell && this._updateGameBoard(currentPlayer, spell);
  }

  _updateGameBoard(currentPlayer: PlayerString, spell: Spell) {
    let otherPlayer = this.otherPlayer(currentPlayer);;
    const damage = spell['damage'];
    const selfDamage = spell["selfDamage"];
    const delayTimeDamage = spell["delayTimeDamage"];
    const cooldownTime = spell["cooldownTime"];
    const stunTime = spell["stunTime"];
    const invulnerabilityTime = spell["invulnerabilityTime"];
    const overtimeDamage = spell["overtimeDamage"];
    const overTimeDamageDuration = spell["overTimeDamageDuration"];

    switch (spell['name']) {
      case 'Quick Attack':
        console.log('Attacking')
        this._attackPlayer(otherPlayer, damage);
        break;
      case 'Block':
        // set player flag to isBlocking
        this.currentState[currentPlayer].isBlocking = true;
        this._updateStateToPlayers();
        this._disableInput(currentPlayer);
        setTimeout(() => {
          this._enableInput(currentPlayer);
          this.currentState[currentPlayer].isBlocking = false;
          this._updateStateToPlayers();
        }, 2000);
        break;
      default:
        break;
    }
    this._updateStateToPlayers();
    this._checkGameOver();
  }

  update(text: string) {
    let textSplit = text.split(": ");
    let sender: string;
    if (textSplit[0] === 'Player1' || textSplit[0] === 'Player2') {
      const attacker: PlayerString = textSplit[0];
      const msg: string = textSplit[1];
      this._updateGameState(attacker, msg);
    }
  }

  _updateStateToPlayers() {
    this._players.forEach((player) => {
      player.emit('state', this.currentState);
    });
  }

  _sendToPlayer(playerIndex: number, msg: string) {
    msg = `Player ${playerIndex+1}: ${msg}`
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

    if (this.currentState['Player1']['hp'] <= 0) {
      let winner = this._players[1];
      let loser = this._players[0];
      endGame(winner, loser);
    } else if (this.currentState['Player2']['hp'] <= 0) {
      let winner = this._players[0];
      let loser = this._players[1];
      endGame(winner, loser);
    }
  }

  _disableInput(player: PlayerString) {
    this.currentState[player]['disabled'] = true;
  }

  _enableInput(player: PlayerString) {
    this.currentState[player]['disabled'] = false;
  }

  _sendWinMessage(winner: socketio.Socket, loser: socketio.Socket) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

}
