export type PlayerInfo = {
  hp: number;
  name: string;
  disabled: boolean;
  isInvulnerable: boolean;
  // spellQueue: Spell | undefined
};

export type BoardState = {
  Player1: PlayerInfo;
  Player2: PlayerInfo;
};
