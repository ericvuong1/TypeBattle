import React from "react";

import "./PlayerInput.css";

interface Props {
  value: string;
  playerInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const PlayerInput: React.FC<Props> = ({
  value,
  playerInputChange,
  onEnterKeyPress,
}) => {
  return (
    <div className="PlayerInputBox">
      <input
        type="text"
        value={value}
        onChange={playerInputChange}
        placeholder="Enter Attack Command"
        onKeyPress={onEnterKeyPress}
        maxLength={30}
      ></input>
      <div className="EnterButton">Enter</div>
    </div>
  );
};

export default PlayerInput;
