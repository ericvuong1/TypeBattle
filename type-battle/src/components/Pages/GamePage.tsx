import React, { useState } from "react";
import GameplayContainer from "../GameplayContainer/GameplayContainer";

import io from "socket.io-client";

const socket = io("http://localhost:8080");

function GamePage(): JSX.Element {
  let [info, setInfo] = useState<string>("");
  let [messages, setMessages] = useState<string[]>([]);
  let [state, setState] = useState({});
  let [playerInputSkill, setPlayerInputSkill] = useState<string>("");

  //socket.on("message", (text: string) => setMessages([...messages, text]));
  socket.on("info", (text: string) => setInfo(text));
  socket.on("state", (text: string) => setState(text));

  const onPlayerCommandSubmit = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPlayerInputSkill((playerInputSkill) => (playerInputSkill = value));
    console.log(playerInputSkill);
  };

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      //Rename Messages to setSkillUse?
      socket.send("message", (playerInputSkill: string) =>
        setMessages([...messages, playerInputSkill])
      );
      //reset input textbox value to none, need to add cooldown timer
      setPlayerInputSkill((playerInputSkill) => (playerInputSkill = ""));
    }
  };
  return (
    <div>
      <GameplayContainer
        value={playerInputSkill}
        inputChange={onPlayerCommandSubmit}
        onEnterKeyPress={onEnterKeyPress}
      />
      <header>{info}</header>
      <header>{messages}</header>
      <header>{JSON.stringify(state)}</header>
    </div>
  );
}

export default GamePage;
