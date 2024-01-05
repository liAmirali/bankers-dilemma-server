type GameT = {
  game_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
};

type JoinGameDataT = {
  gameId: string | number;
}

type LeaveGameDataT = {
  gameId: number;
}

type PlayDataT = {
  gameId: number,
  move: "confront" | "cooperate"
}

type GameRoomDetails = {
  players: string[],
  isStarted: boolean
}