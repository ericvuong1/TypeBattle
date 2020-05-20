const Player = require('./player');

class TypeBattleGame {

  constructor(p1, p2) {
    this._players = [p1, p2];
    this._turns = [null, null];
    this.player1 = Player(100, 'Player1');
    this.player2 = Player(100, 'Player2');

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

  otherPlayer(player) {
    if (player == 'Player1') {
      return 'Player2';
    } else {
      return 'Player1';
    }
  }

  _attackPlayer(player, damage) {
      this.currentState[player]['hp'] = this.currentState[player]['hp'] - damage;
  }

  update(msg) {
    let [attacker, spell] = msg.split(": ");
    switch (spell) {
      case 'Quick Attack':
        let otherPlayer = this.otherPlayer(attacker);
        let damage = 10;
        this._attackPlayer(otherPlayer, damage);
        break;
      default:
        break;
    }
    this._updateStateToPlayers();
    this._checkGameOver();
  }

  _updateStateToPlayers() {
    this._players.forEach((player) => {
      player.emit('state', this.currentState);
    });
  }

  _sendToPlayer(playerIndex, msg) {
    msg = `Player ${playerIndex+1}: ${msg}`
    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }

  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `You selected ${turn}`);

    this._checkGameOver();
  }

  _checkGameOver() {
    let a = (winner, loser) => {
      this._disableInput('Player1');
      this._disableInput('Player2');
      this._updateStateToPlayers();
      this._sendWinMessage(winner, loser);
    }

    if (this.currentState['Player1']['hp'] <= 0) {
      let winner = this._players[1];
      let loser = this._players[0];
      a(winner, loser);
    } else if (this.currentState['Player2']['hp'] <= 0) {
      let winner = this._players[0];
      let loser = this._players[1];
      a(winner, loser);
    }
  }

  _disableInput(player) {
    this.currentState[player]['disabled'] = true;
  }

  _enableInput(player) {
    this.currentState[player]['disabled'] = false;
  }

  _sendWinMessage(winner, loser) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

}

module.exports = TypeBattleGame;
