let playerName = null;

const writeEvent = (text) => {
  const parent = document.querySelector('#events');

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
  console.log('NEW STATE', state);
  currentPlayer = state[playerName];
  enemyPlayer = state[enemyName];
  console.log('current', currentPlayer);
  console.log('enemy', enemyPlayer);

  /** 
  TODO: HACKY way to update state by wiping the header and reappending
  Removes all #playerInfo and repopulate the elements
  */  
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
    input.focus()
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

writeEvent('Welcome to Type Battle!');

const sock = io();
sock.on('message', writeEvent);
sock.on('info', setPlayerName);
sock.on('state', updateGameState);


document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);
