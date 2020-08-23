import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import io from "socket.io-client"

// const socket = io('http://192.168.2.11:8080');

const socket = io('http://localhost:8080');

type Player = {
    hp: number
    name: string
    disabled: boolean
    isInvulnerable: boolean
    // spellQueue: Spell | undefined
}

type BoardState = {
  "Player1": Player,
  "Player2": Player
}

// TODO: Why put it outside function works?
let messages: string[] = []

const GameComponent = (): JSX.Element => {
  let [info, setInfo] = useState<"Player1" | "Player2" | "Player?">("Player?")
  let [state, setState] = useState<BoardState | undefined >(undefined);

  useEffect(() => {
    socket.on('info', (currentPlayer: "Player1" | "Player2") => setInfo(currentPlayer));
    socket.on('state', (boardState: BoardState) => setState(boardState));
    socket.on('message', (text: string) => {
      messages = [...messages, text]
    });
  }, []);

  const castSpell = (spell: string) => {return function() {
      const message = `${info}: ${spell}`;
      console.log(message);
      socket.emit('message', message);
      socket.emit('update', message);
    }
  }
  console.log('loaded')

  return (
    <div>
      <li>
        {messages.map((e,i) => {
          return (<ul key={i}>{e}</ul>)
        })}
      </li>
      <header>{info}</header>
      <header>{(state && info != "Player?") && state[info]['hp']}</header>
      <button onClick={castSpell('Quick Attack')}>Quick Attack</button>
      <button onClick={castSpell('Block')}>Block</button>
    </div>
  )
}

function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <GameComponent />
      </header>
    </div>
  );
}


export default App;
