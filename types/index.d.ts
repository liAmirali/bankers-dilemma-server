type GameT = {
  game_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
};

type JoinGameDataT = {
  gameId: number;
}

type LeaveGameDataT = {
  gameId: number;
}

type PlayDataT = {
  gameId: number,
  move: "confront" | "cooperate"
}