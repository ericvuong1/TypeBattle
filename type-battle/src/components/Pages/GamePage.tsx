import React, { useState, useMemo } from "react";
import GameplayContainer from "../GameplayContainer/GameplayContainer";
import PlayerHP from "../PlayerHp/PlayerHP";

import io from "socket.io-client";

const socket = io("http://localhost:8080");

function GamePage(): JSX.Element {
  let [info, setInfo] = useState<string>("");
  let [messages, setMessages] = useState<string[]>([]);
  let [state, setState] = useState({});
  let [playerInputSkill, setPlayerInputSkill] = useState<string>(""); // use useRef

  socket.on("message", (text: string) => setMessages([...messages, text]));
  socket.on("info", (text: string) => setInfo(text));
  socket.on("state", (text: string) => setState(text));

  const onPlayerCommandSubmit = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPlayerInputSkill((playerInputSkill) => (playerInputSkill = value));
  };

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && playerInputSkill !== "") {
      const messageToSend = `${info}: ${playerInputSkill}`;
      socket.send(messageToSend);

      //reset input textbox value, need to add cooldown timer
      setPlayerInputSkill((playerInputSkill) => (playerInputSkill = ""));
    }
  };

  return (
    <div>
      <h1>Typebattle</h1>
      <div>
        <GameplayContainer
          value={playerInputSkill}
          inputChange={onPlayerCommandSubmit}
          onEnterKeyPress={onEnterKeyPress}
          messages={messages}
        />
        <PlayerHP playerState={state} />
      </div>
    </div>
  );
}

export default GamePage;
