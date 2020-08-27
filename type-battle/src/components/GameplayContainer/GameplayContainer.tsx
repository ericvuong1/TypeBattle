import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ChatLogDisplay from "../ChatLogDisplay/ChatLogDisplay";
import PlayerInput from "../PlayerInput/PlayerInput";

interface Props {
  value: string;
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  messages: string[];
  gameEnd: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    gameplayContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "500px",
      width: "400px",
      margin: "auto",
    },
    chatLogContainer: {
      height: "100%",
      maxHeight: "100%",
      border: "2px solid rgb(0, 162, 255)",
      borderRadius: "0.5rem",
      overflow: "auto",
    },
  })
);

const availableSkills = (
  <div>
    <h3>Available skills</h3>
    <GridList cellHeight={70}>
      <GridListTile>
        <p>Quick Attack</p>
      </GridListTile>
      <GridListTile>
        <p>Block</p>
      </GridListTile>
    </GridList>
  </div>
);

const GameplayContainer: React.FC<Props> = ({
  value,
  inputChange,
  onEnterKeyPress,
  messages,
  gameEnd,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.gameplayContainer}>
      <div className={classes.chatLogContainer} id="scrolltobottom">
        {messages.map((playerInput: string, index) => (
          <ChatLogDisplay playerInput={playerInput} key={index} />
        ))}
      </div>
      <PlayerInput
        value={value}
        playerInputChange={inputChange}
        onEnterKeyPress={onEnterKeyPress}
        gameEnd={gameEnd}
      />
      {availableSkills}
    </div>
  );
};

export default GameplayContainer;
