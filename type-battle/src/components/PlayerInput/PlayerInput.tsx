import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

interface Props {
  value: string;
  playerInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    PlayerInputBox: {
      width: "100%",
      border: "1px solid black",
      borderRadius: "0.5rem",
      background: "none",
      display: "flex",
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

const PlayerInput: React.FC<Props> = ({
  value,
  playerInputChange,
  onEnterKeyPress,
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
      ></TextField>
      <Button className={classes.button} variant="contained">
        Enter
      </Button>
    </div>
  );
};

export default PlayerInput;
