import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import io from "socket.io-client"

// const socket = io('http://localhost:8080');
const socket = io('http://192.168.2.11:8080');


function App(): JSX.Element {

  let [info, setInfo] = useState<string>("")
  let [messages, setMessages] = useState<string[]>([])
  let [state, setState] = useState({});

  socket.on('message', (text:string) => setMessages([...messages, text]));
  socket.on('info', (text:string) => setInfo(text));
  socket.on('state', (text:string) => setState(text));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <header>{info}</header>
        <header>{messages}</header>
        <header>{JSON.stringify(state)}</header>
      </header>
    </div>
  );
}


export default App;
