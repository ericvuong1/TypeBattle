import React from "react";
import { PlayerInfo } from "../Type/Type";
import PlayerHp from "../PlayerHp/PlayerHP";

interface Props {
  playerState: PlayerInfo | undefined | false;
}

const Player: React.FC<Props> = ({ playerState }) => {
  let playerName = playerState && playerState["name"];
  let playerhealth = playerState && playerState["hp"];
  return (
    <div>
      <>{playerName}</>
      <PlayerHp playerRemainingHealth={playerhealth} />
    </div>
  );
};

export default Player;
