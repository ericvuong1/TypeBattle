import React from "react";

import ChatLogDisplay from "../ChatLogDisplay/ChatLogDisplay";
import PlayerInput from "../PlayerInput/PlayerInput";

import "./GameplayContainer.css";

interface Props {
  value: string;
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  messages: string[];
}

const GameplayContainer: React.FC<Props> = ({
  value,
  inputChange,
  onEnterKeyPress,
  messages,
}) => {
  return (
    <div className="GameplayContainer">
      <div className="ChatLogContainer">
        {messages.map((playerInput: string, index) => (
          <ChatLogDisplay playerInput={playerInput} key={index} />
        ))}
      </div>

      <PlayerInput
        value={value}
        playerInputChange={inputChange}
        onEnterKeyPress={onEnterKeyPress}
      />
    </div>
  );
};

export default GameplayContainer;
