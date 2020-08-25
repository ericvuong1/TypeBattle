import React from "react";
import { BoardState, PlayerInfo } from "../Type/Type";
import PlayerHp from "../PlayerHp/PlayerHP";

interface Props {
  playerState: PlayerInfo | undefined;
  playerInfo: "Player1" | "Player2" | "Player?";
}

const Player: React.FC<Props> = ({ playerState, playerInfo }) => {
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
