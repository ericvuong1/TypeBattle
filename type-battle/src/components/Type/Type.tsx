export type Player = {
  hp: number;
  name: string;
  disabled: boolean;
  isInvulnerable: boolean;
  // spellQueue: Spell | undefined
};

export type BoardState = {
  Player1: Player;
  Player2: Player;
};
