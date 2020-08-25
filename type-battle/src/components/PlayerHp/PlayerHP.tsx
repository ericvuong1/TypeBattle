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
    },
  })
);

const PlayerHP: React.FC<Props> = ({ playerRemainingHealth }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.playerhpbar}>
        <div
          style={{
            width: `${playerRemainingHealth}%`,
            height: "20px",
            backgroundColor: "green",
            borderRadius: "5px",
          }}
        >
          {playerRemainingHealth}
        </div>
      </div>
    </div>
  );
};

export default PlayerHP;
