import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { BoardState } from "../Type/Type";

interface Props {
  playerState: BoardState | undefined;
  playerInfo: "Player1" | "Player2" | "Player?";
}

const useStyles = makeStyles(() =>
  createStyles({
    playerhpbar: {
      width: "500px",
      backgroundColor: "red",
      borderRadius: "5px",
    },
  })
);

const PlayerHP: React.FC<Props> = ({ playerState, playerInfo }) => {
  const classes = useStyles();
  let hpbarwidth =
    playerState && playerInfo !== "Player?" && playerState[playerInfo]["hp"];
  let playerName =
    playerState && playerInfo !== "Player?" && playerState[playerInfo]["name"];
  return (
    <div>
      {playerName}
      <div className={classes.playerhpbar}>
        <div
          style={{
            width: `${hpbarwidth}%`,
            height: "20px",
            backgroundColor: "green",
            borderRadius: "5px",
          }}
        >
          {playerState &&
            playerInfo !== "Player?" &&
            playerState[playerInfo]["hp"]}
        </div>
      </div>
    </div>
  );
};

export default PlayerHP;
