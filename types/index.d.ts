type GameT = {
  game_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
};

type JoinGameDataT = {
  gameId: string | number;
};

type LeaveGameDataT = {
  gameId: number;
};

type PlayDataT = {
  gameId: number;
  sid: string;
  move: "confront" | "cooperate";
};

type PlayerDataT = {
  sid: string;
  score: number;
  latestMove: MoveOption | null;
};

type GameRoomDetails = {
  players: [PlayerDataT | null, PlayerDataT | null];
  isStarted: boolean;
  playersCount: number;
};

type PlayerMoveT = {
  sid: string;
  move: MoveOption;
  score: number;
};

type TurnResultT = {
  gameId: number;
  moves: [PlayerMoveT, PlayerMoveT];
};

type MoveOption = "confront" | "cooperate";
