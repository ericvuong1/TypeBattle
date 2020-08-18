import React from "react";

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
    <div>
      <input
        type="text"
        value={value}
        onChange={playerInputChange}
        placeholder="Enter Attack Command"
        onKeyPress={onEnterKeyPress}
      ></input>
    </div>
  );
};

export default PlayerInput;
