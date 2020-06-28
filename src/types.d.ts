// User Types

type ServerPlayerMetadata = {
  id: number; // WHY
  name: string;
};

type UserGameInfo = {
  gameID: string;
  playerID: string;
  playerCredentials: string;
  scoreList: ScoreList;
  createdAt: string;
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
    reorderRackTiles: (rackTiles: Tile[]) => void;
  };
  events: {
    endTurn: any;
  };
};

type CurrentPlayInfo = {
  invalidReason: string;
  tilesLaid: Tile[];
  valid: boolean;
  played: boolean;
  score: number;
};

type PlayerInfo = {
  nickname: string;
  tileRack: Tile[];
  currentPlay: CurrentPlayInfo;
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
  remainingTileCount: number;
  turns: Turn[];
  turnsReverse: Turn[];
  players: {
    [key: string]: PlayerInfo;
  };
  scoreList: ScoreList;
};

type ScoreList = {
  [key: string]: ScoreData;
};

type ScoreData = {
  nickname: string;
  score: number;
};

type GameOver = {
  scoreList: ScoreList;
  winner?: string;
  draw?: boolean;
  finalScores: {
    [key: string]: number;
  };
  finalTurns: Turn[];
};

type GameContext = {
  events: {
    endTurn: any;
  };
  turn: number;
  currentPlayer: string;
  gameover?: GameOver;
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

declare module "react-dnd-preview" {
  export function usePreview(): Any;
}
