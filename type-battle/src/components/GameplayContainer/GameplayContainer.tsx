import React from "react";

import ChatLogDisplay from "../ChatLogDisplay/ChatLogDisplay";
import PlayerInput from "../PlayerInput/PlayerInput";

interface Props {
  value: string;
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const GameplayContainer: React.FC<Props> = ({
  value,
  inputChange,
  onEnterKeyPress,
}) => {
  return (
    <div>
      <ChatLogDisplay />
      <PlayerInput
        value={value}
        playerInputChange={inputChange}
        onEnterKeyPress={onEnterKeyPress}
      />
    </div>
  );
};

export default GameplayContainer;
