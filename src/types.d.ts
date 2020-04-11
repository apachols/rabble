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

type WordList = {
  [key: string]: number;
};

type Tile = {
  letter: string;
  value: number;
};

type TileClass = {
  letter: string;
  value: number;
  frequency: number;
};

type TileBagConfig = {
  [key: string]: TileClass;
};

// Boardgame.io Types

type PlayerInfo = {
  tileRack: Tile[];
  score: number;
  currentPlay: {
    tilesLaid: Tile[];
    valid: boolean;
  };
};

type Turn = {
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
