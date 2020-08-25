import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import ChatLogDisplay from "../ChatLogDisplay/ChatLogDisplay";
import PlayerInput from "../PlayerInput/PlayerInput";

interface Props {
  value: string;
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  messages: string[];
}

const useStyles = makeStyles(() =>
  createStyles({
    gameplayContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "350px",
      width: "400px",
      margin: "auto",
    },
    chatLogContainer: {
      height: "100%",
      maxHeight: "100%",
      border: "2px solid rgb(0, 162, 255)",
      borderRadius: "0.5rem",
      overflow: "auto",
      marginBottom: "1.5rem",
    },
  })
);

const GameplayContainer: React.FC<Props> = ({
  value,
  inputChange,
  onEnterKeyPress,
  messages,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.gameplayContainer}>
      <div className={classes.chatLogContainer}>
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
