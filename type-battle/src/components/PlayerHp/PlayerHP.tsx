import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";

interface Props {
  playerRemainingHealth: number | false | undefined;
}

const useStyles = makeStyles(() =>
  createStyles({
    playerhpbar: {
      width: "500px",
      backgroundColor: "red",
      borderRadius: "5px",
      margin: "1rem 0",
    },
  })
);

const PlayerHP: React.FC<Props> = ({ playerRemainingHealth }) => {
  const classes = useStyles();

  return (
    <div style={{ display: "flex" }}>
      <div className={classes.playerhpbar}>
        <div
          style={{
            width: `${playerRemainingHealth}%`,
            height: "21px",
            backgroundColor: "green",
            borderRadius: "5px",
          }}
        ></div>
      </div>
      {playerRemainingHealth}
    </div>
  );
};

export default PlayerHP;
