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
      console.log(text, '456');
      messages = [...messages, text]
      console.log(messages, '789');
    });
  }, []);


  const attack = (): void => {
    const message = `${info}: Quick Attack`;
    console.log(message);
    socket.emit('message', message);
    socket.emit('update', message);
  }
  console.log('loaded')

  return (
    <div>
      <header>{info}</header>
      <header>{messages}</header>
      <header>{JSON.stringify(state)}</header>
      <button onClick={attack}>hi</button>
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
