import React, { useState, useEffect } from "react";
import GameplayContainer from "../GameplayContainer/GameplayContainer";
import Player from "../Player/Player";
import { BoardState } from "../Type/Type";
import Divider from "@material-ui/core/Divider";

import io from "socket.io-client";

const socket = io("http://localhost:8080");

// TODO: Why put it outside function works?
let messages: string[] = [];

function GamePage(): JSX.Element {
  let [info, setInfo] = useState<"Player1" | "Player2" | "Player?">("Player?"); //TODO: how to show player 2? can we use info?
  let [state, setState] = useState<BoardState | undefined>(undefined); // Seems like the state shows player 1 and player 2
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
      //console.log("567");

      //reset input textbox value, need to add cooldown timer
      setPlayerInputSkill((playerInputSkill) => (playerInputSkill = ""));
      console.log("reset");
    }
  };
  //TODO: how to identify which player is you and which one is the enemy
  return (
    <div>
      <h1>Typebattle</h1>
      <Divider />
      <div
        style={{
          display: "flex",
          marginTop: "2rem",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Player playerState={state?.Player1} />
        <GameplayContainer
          value={playerInputSkill}
          inputChange={onPlayerCommandSubmit}
          onEnterKeyPress={onEnterKeyPress}
          messages={messages}
        />
        <Player playerState={state?.Player2} />
      </div>
    </div>
  );
}

export default GamePage;
