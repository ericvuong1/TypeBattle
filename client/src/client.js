let playerName = null;

const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.prepend(el);
};

const setPlayerName = (text) => {
  playerName = text;
  if (playerName == 'Player1') {
    enemyName = 'Player2';
  } else {
    enemyName = 'Player1';
  }
}

function removeChildrenFromParent(parent) {
  let child = parent.firstElementChild;
  while(child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
}

const updateGameState = (state) => {
  console.log('Game state update');
  console.log(state);
  currentPlayer = state[playerName];
  enemyPlayer = state[enemyName];
  console.log('current', currentPlayer);
  console.log('enemy', enemyPlayer);

  // TODO: update state correctly

  const parent = document.querySelector('#playerInfo');
  removeChildrenFromParent(parent);
  const you = document.createElement('h1');
  you.innerHTML = `YOU: ${currentPlayer['name']}`;
  const yourHP = document.createElement('h1');
  yourHP.innerHTML = `HP: ${currentPlayer['hp']}`
  const enemy = document.createElement('h1');
  enemy.innerHTML = `ENEMY: ${enemyPlayer['name']}`;
  const enemyHP = document.createElement('h1');
  enemyHP.innerHTML = `HP: ${enemyPlayer['hp']}`

  parent.append(you);
  parent.append(yourHP);
  parent.append(enemy);
  parent.append(enemyHP);

  // Check for disabled spells
  const input = document.querySelector('#chat')
  if (state[playerName]['disabled']) {
    input.disabled = true;
  } else {
    input.disabled = false;
  }
}

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  console.log(playerName);
  message = `${playerName}: ${text}`;

  sock.emit('message', message);
  sock.emit('update', message);
};

const addButtonListeners = () => {
  // ['rock', 'paper', 'scissors'].forEach((id) => {
  //   const button = document.getElementById(id);
  //   button.addEventListener('click', () => {
  //     sock.emit('turn', id);
  //   });
  // });
};

const gameUpdate = (gameUpdate) => {
  // TODO: Update game state
  console.log('Updating Game!');
  console.log(gameUpdate)
}

writeEvent('Welcome to Type Battle!');

const sock = io();
sock.on('message', writeEvent);
sock.on('info', setPlayerName);
sock.on('state', updateGameState);

document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);

addButtonListeners();
