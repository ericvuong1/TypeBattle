import React from "react";

import "./ChatLogDisplay.css";

interface Props {
  playerInput: string;
}

const ChatLogDisplay: React.FC<Props> = (playerInput) => {
  return <div className="PlayerInputLog">{playerInput.playerInput}</div>;
};

export default ChatLogDisplay;
