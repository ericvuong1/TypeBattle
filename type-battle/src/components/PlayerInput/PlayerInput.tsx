import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

interface Props {
  value: string;
  playerInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  gameEnd: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    PlayerInputBox: {
      width: "100%",
      border: "1px solid black",
      borderRadius: "0.5rem",
      background: "none",
      display: "flex",
      margin: "1.5rem 0",
    },
    input: {
      "&.MuiOutlinedInput-root": {
        border: "none",
        width: "20rem",
      },
      "&.Mui-focused fieldset": {
        border: "none",
      },
    },
    button: {
      backgroundColor: "rgb(0, 162, 255)",
      borderRadius: "0.5rem",
    },
  })
);

const disableCopyPaste = (event: React.ClipboardEvent) => {
  event.preventDefault();
};

const PlayerInput: React.FC<Props> = ({
  value,
  playerInputChange,
  onEnterKeyPress,
  gameEnd,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.PlayerInputBox}>
      <TextField
        value={value}
        variant="outlined"
        onChange={playerInputChange}
        onKeyPress={onEnterKeyPress}
        placeholder="Enter Command"
        inputProps={{ maxLength: 30 }}
        InputProps={{
          className: classes.input,
        }}
        onCopy={disableCopyPaste}
        onPaste={disableCopyPaste}
        disabled={gameEnd}
      ></TextField>
      <Button className={classes.button} variant="contained">
        Enter
      </Button>
    </div>
  );
};

export default PlayerInput;
