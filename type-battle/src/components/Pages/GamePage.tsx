import React, { useState, useEffect } from "react";
import GameplayContainer from "../GameplayContainer/GameplayContainer";
import Player from "../Player/Player";
import { BoardState, PlayerInfo } from "../Type/Type";
import Divider from "@material-ui/core/Divider";

import io from "socket.io-client";

const socket = io("http://localhost:8080");

// TODO: Why put it outside function works?
let messages: string[] = [];
let ENEMY_PLAYER: "Player1" | "Player2" | "Player?" = "Player?";

function GamePage(): JSX.Element {
  let [info, setInfo] = useState<"Player1" | "Player2" | "Player?">("Player?"); //TODO: how to show player 2? can we use info?
  let [state, setState] = useState<BoardState | undefined>(undefined); // Seems like the state shows player 1 and player 2
  let [playerInputSkill, setPlayerInputSkill] = useState<string>(""); // use useRef
  let [playerInputDisabled, setPlayerInputDisabled] = useState<boolean>(false);
  let currentPlayer: PlayerInfo | undefined | false =
    state && info !== "Player?" && state[info];
  let enemyPlayer: PlayerInfo | undefined | false =
    state && ENEMY_PLAYER !== "Player?" && state[ENEMY_PLAYER];

  useEffect(() => {
    socket.on("info", (currentPlayer: "Player1" | "Player2") => {
      setInfo(currentPlayer);
      if (currentPlayer === "Player1") ENEMY_PLAYER = "Player2";
      if (currentPlayer === "Player2") ENEMY_PLAYER = "Player1";
    });
    socket.on("state", (boardState: BoardState) => setState(boardState));
    socket.on("message", (text: string) => {
      messages = [...messages, text];
    });
  }, []);

  useEffect(() => {
    chatDisplayScrollToBottom();
    winnerDecider();
  });

  const chatDisplayScrollToBottom = () => {
    let chatBoxElement = document.getElementById("scrolltobottom");
    // @ts-ignore
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
  };

  const onPlayerCommandSubmit = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPlayerInputSkill((playerInputSkill) => (playerInputSkill = value));
  };

  const winnerDecider = () => {
    if (state?.Player1["hp"] || state?.Player2["hp"] === 0)
      setPlayerInputDisabled(true);
  };

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && playerInputSkill !== "") {
      const messageToSend = `${info}: ${playerInputSkill}`;
      socket.emit("message", messageToSend);
      socket.emit("update", messageToSend);

      //reset input textbox value, need to add cooldown timer
      setPlayerInputSkill((playerInputSkill) => (playerInputSkill = ""));
      //Bug, can send one more message before input is disabled
      //winnerDecider();
    }
  };

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
        <Player playerState={enemyPlayer} />
        <GameplayContainer
          value={playerInputSkill}
          inputChange={onPlayerCommandSubmit}
          onEnterKeyPress={onEnterKeyPress}
          messages={messages}
          gameEnd={playerInputDisabled}
        />
        <Player playerState={currentPlayer} />
      </div>
    </div>
  );
}

export default GamePage;
