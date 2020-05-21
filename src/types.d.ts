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

type Direction = "H" | "V" | null;

type Square = {
  bonus: string | null;
  location: number;
  tile: Tile | null;
  playTile: Tile | null;
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

type GameBoardProps = {
  G: Game;
  ctx: GameContext;
  playerID: string;
  nowPlaying: string;
  moves: {
    drawTiles: () => void;
    exchangeTiles: (tiles: Tile[]) => void;
    playWord: (playSquares: Square[]) => void;
    checkWord: (playSquares: Square[]) => void;
    cleanUp: () => void;
    setNickName: (nickname: string) => void;
  };
  events: {
    endTurn: any;
  };
};

type PlayerInfo = {
  nickname: string;
  tileRack: Tile[];
  currentPlay: {
    invalidReason: string;
    tilesLaid: Tile[];
    valid: boolean;
  };
};

type Turn = {
  turnID: string;
  playerID: string;
  nickname: string;
  tiles: Tile[];
  score: number;
};

type Game = {
  gameBoard: Square[];
  tileBag: Tile[];
  turns: Turn[];
  players: {
    [key: string]: PlayerInfo;
  };
  scores: {
    [key: string]: number;
  };
};

type GameContext = {
  events: {
    endTurn: any;
  };
  turn: number;
  currentPlayer: string;
  gameover?: {
    winner?: number;
    draw?: boolean;
    finalScores: {
      [key: string]: number;
    };
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
  visibleAt?: number;
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
