import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import io from "socket.io-client"

// const socket = io('http://192.168.2.11:8080');

const socket = io('http://localhost:8080');

// TODO: Why put it outside function works?
let messages: string[] = []

const GameComponent = (): JSX.Element => {
  let [info, setInfo] = useState<string>("")
  let [state, setState] = useState({});

  useEffect(() => {
    socket.on('info', (text: string) => setInfo(text));
    socket.on('state', (text: string) => setState(text));
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
      <header>{JSON.stringify(state)}</header>
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
