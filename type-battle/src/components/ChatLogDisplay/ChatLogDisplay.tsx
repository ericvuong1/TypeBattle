import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles } from "@material-ui/core/styles";

interface Props {
  playerInput: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      textAlign: "start",
      padding: "0.5rem 1rem",
    },
  })
);

const ChatLogDisplay: React.FC<Props> = (playerInput) => {
  const classes = useStyles();
  return (
    <ListItemText classes={{ primary: classes.root }}>
      {playerInput.playerInput}
    </ListItemText>
  );
};

export default ChatLogDisplay;
