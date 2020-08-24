import React, { useState, useEffect } from "react";
import GameplayContainer from "../GameplayContainer/GameplayContainer";
import PlayerHP from "../PlayerHp/PlayerHP";
import { BoardState } from "../Type/Type";

import io from "socket.io-client";

const socket = io("http://localhost:8080");

// TODO: Why put it outside function works?
let messages: string[] = [];

function GamePage(): JSX.Element {
  // let [messages, setMessages] = useState<string[]>([]);
  let [info, setInfo] = useState<"Player1" | "Player2" | "Player?">("Player?");
  let [state, setState] = useState<BoardState | undefined>(undefined);
  let [playerInputSkill, setPlayerInputSkill] = useState<string>(""); // use useRef

  useEffect(() => {
    socket.on("info", (currentPlayer: "Player1" | "Player2") =>
      setInfo(currentPlayer)
    );
    socket.on("state", (boardState: BoardState) => setState(boardState));
    socket.on("message", (text: string) => {
      messages = [...messages, text];
    });
  }, []);

  const onPlayerCommandSubmit = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPlayerInputSkill((playerInputSkill) => (playerInputSkill = value));
  };

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && playerInputSkill !== "") {
      const messageToSend = `${info}: ${playerInputSkill}`;
      socket.emit("message", messageToSend);
      socket.emit("update", messageToSend);
      console.log("567");

      //reset input textbox value, need to add cooldown timer
      setPlayerInputSkill((playerInputSkill) => (playerInputSkill = ""));
      console.log("reset");
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
        <PlayerHP playerState={state} playerInfo={info} />
      </div>
    </div>
  );
}

export default GamePage;
