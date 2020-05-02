// User Types

type UserGameInfo = {
  gameID: string;
  playerID: string;
  playerCredentials: string;
};

type UserInfo = {
  nickname: string;
  games: {
    [key: string]: UserGameInfo;
  };
};

// Rabble Types

type Bonus = { bonus: string; locations: number[] };

type Square = {
  bonus: string | null;
  location: number;
  tile: Tile | null;
  selection: string | null;
};

type WordList = {
  [key: string]: number;
};

type Tile = {
  letter: string;
  value: number;
  blank: boolean;
};

type TileClass = {
  letter: string;
  value: number;
  frequency: number;
  blank: boolean;
};

type TileBagConfig = {
  [key: string]: TileClass;
};

// Boardgame.io Types

type PlayerInfo = {
  tileRack: Tile[];
  score: number;
  currentPlay: {
    invalidReason: string;
    tilesLaid: Tile[];
    valid: boolean;
  };
};

type Turn = {
  turnID: string;
  playerID: string;
  tiles: Tile[];
  score: number;
};

type Game = {
  tileBag: Tile[];
  turns: Turn[];
  players: {
    [key: string]: PlayerInfo;
  };
};

type GameContext = {
  turn: number;
  currentPlayer: string;
  gameover?: {
    winner?: number;
    draw?: boolean;
  };
};

type GameConfig = {
  name: string;
};

type ClientConfig = {
  debug: boolean;
  game: Object;
  board: Object;
  multiplayer: Object;
};

type SocketConfig = {
  server: string;
};

type ServerConfig = {
  games: Array<GameConfig>;
  db: Any;
};

type FlatFileConfig = {
  dir: string;
  logging: boolean;
};

declare module "boardgame.io/core" {
  export const INVALID_MOVE: string;
}

declare module "boardgame.io/react" {
  export function Client(config: ClientConfig): Any;
}

declare module "boardgame.io/multiplayer" {
  export function Local(): Any;
  export function SocketIO(config: SocketConfig): Any;
}

declare module "boardgame.io/server" {
  export function Server(config: ServerConfig): Any;
  export class FlatFile extends Object {
    constructor(config: FlatFileConfig);
  }
}
