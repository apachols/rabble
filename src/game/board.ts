import { stringFromTiles } from "./tileBag";

export const HORIZONTAL = "H";
export const VERTICAL = "V";
export const CENTER_SQUARE = 112;

export const bonusConfig = {
  W3: [0, 7, 14, 105, 119, 210, 217, 224],
  W2: [
    16,
    28,
    32,
    42,
    48,
    56,
    64,
    70,
    112,
    154,
    160,
    168,
    176,
    182,
    192,
    196,
    208,
  ],
  L3: [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204],
  L2: [
    3,
    11,
    36,
    38,
    45,
    52,
    59,
    92,
    96,
    98,
    102,
    108,
    116,
    122,
    126,
    128,
    132,
    165,
    172,
    179,
    186,
    188,
    213,
    221,
  ],
};

export const getPreviousLocation = (
  location: number,
  direction: Direction
): number | null => {
  if (!direction || location === null) {
    return null;
  }
  if (location < 0 || location > 224) {
    return null;
  }
  if (direction === VERTICAL) {
    const prev = location - 15;
    return prev < 0 ? null : prev;
  }
  if (direction === HORIZONTAL) {
    const prev = location - 1;
    if (prev >= 0 && prev % 15 === (location % 15) - 1) {
      return prev;
    }
    return null;
  }
  return null;
};

export const getNextLocation = (
  location: number,
  direction: Direction
): number | null => {
  if (!direction || location === null) {
    return null;
  }
  if (location < 0 || location > 224) {
    return null;
  }
  if (direction === VERTICAL) {
    const next = location + 15;
    return next >= 225 ? null : next;
  }
  if (direction === HORIZONTAL) {
    const next = location + 1;
    if (next < 225 && next % 15 === (location % 15) + 1) {
      return next;
    }
    return null;
  }
  return null;
};

export const generateBoard = () => {
  const Board: Square[] = [];

  for (let location = 0; location < 225; location++) {
    const square: Square = {
      location,
      bonus: null,
      tile: null,
      playTile: null,
    };
    if (bonusConfig["W3"].includes(location)) {
      square.bonus = "W3";
    }
    if (bonusConfig["W2"].includes(location)) {
      square.bonus = "W2";
    }
    if (bonusConfig["L3"].includes(location)) {
      square.bonus = "L3";
    }
    if (bonusConfig["L2"].includes(location)) {
      square.bonus = "L2";
    }
    Board.push(square);
  }
  return Board;
};

export const isFirstPlay = (gameBoard: Square[]) =>
  !gameBoard.some((s) => s.tile);

export const hasCenterSquare = (playSquares: Square[]) =>
  playSquares.some((s) => s.location === CENTER_SQUARE);

export const rowForLocation = (location: number) => Math.floor(location / 15);
export const columnForLocation = (location: number) => location % 15;
export const anyTile = (square: Square) => square.tile || square.playTile;

export const copyPlaySquaresToBoard = (
  playSquares: Square[],
  gameBoard: Square[]
) => {
  playSquares.forEach(({ location, playTile }) => {
    if (gameBoard[location].tile || gameBoard[location].playTile) {
      throw new Error(`Logic Error - copy to occupied square ${location}`);
    }
    gameBoard[location].playTile = playTile;
  });
};

export const finalizePlayOnBoard = (
  playSquares: Square[],
  gameBoard: Square[]
) => {
  playSquares.forEach((s) => {
    gameBoard[s.location].tile = s.playTile;
  });
};

export const removePlayFromBoard = (gameBoard: Square[]) => {
  gameBoard.forEach((sq) => {
    sq.playTile = null;
  });
};

// TODO write some tests for this, just fixed a loc falsey vs null check...
export const adjacentToAWord = (playSquares: Square[], gameBoard: Square[]) =>
  playSquares.some((s) => {
    const toCheck = [
      getPreviousLocation(s.location, VERTICAL),
      getNextLocation(s.location, VERTICAL),
      getPreviousLocation(s.location, HORIZONTAL),
      getNextLocation(s.location, HORIZONTAL),
    ];
    return toCheck.some((loc) => (loc !== null ? gameBoard[loc].tile : false));
  });

// TS isn't happy with a .filter here... i bet there's a better way
export const playTilesFromSquares = (playSquares: Square[]) => {
  const wordAsTilesOrNulls: (Tile | null)[] = playSquares.map(
    (s) => s.playTile
  );
  const wordAsTiles: Tile[] = [];
  wordAsTilesOrNulls.forEach((t) => {
    if (t) {
      wordAsTiles.push(t);
    }
  });
  return wordAsTiles;
};

// TS isn't happy with a .filter here... i bet there's a better way
export const allTilesFromSquares = (playSquares: Square[]): Tile[] => {
  const filtered: Tile[] = [];
  playSquares
    .map((sq) => anyTile(sq))
    .forEach((t) => {
      if (t) {
        filtered.push(t);
      }
    });
  return filtered;
};

export const squaresAreAValidWord = (
  allSquares: Square[],
  wordlist: WordList
) => Boolean(wordlist[stringFromTiles(allTilesFromSquares(allSquares))]);

export const playDirection = (playSquares: Square[]): Direction => {
  const { location } = playSquares[0];
  const row = rowForLocation(location);
  const column = columnForLocation(location);
  if (playSquares.every((s) => rowForLocation(s.location) === row)) {
    return HORIZONTAL;
  }
  if (playSquares.every((s) => columnForLocation(s.location) === column)) {
    return VERTICAL;
  }
  return null;
};

export const layTiles = ({
  board,
  direction,
  toPlay,
  location,
  callback,
}: {
  board: Square[];
  direction: Direction;
  toPlay: Tile[];
  location: number | null;
  callback: any;
}) => {
  if (location === null || !direction) {
    return;
  }
  if (toPlay.length === 0) {
    return;
  }
  if (board[location].tile) {
    // what if we skipped it:
    callback({
      board,
      direction,
      toPlay,
      location: getNextLocation(location, direction),
      callback,
    });
    return;
  }
  board[location].playTile = toPlay[0];
  callback({
    board,
    direction,
    toPlay: toPlay.slice(1),
    location: getNextLocation(location, direction),
    callback,
  });
};

export const allSquaresInWord = (
  playSquares: Square[],
  gameBoard: Square[],
  direction: Direction
) => {
  const allSquares: Square[] = [];
  // backward
  let prevLocation = getPreviousLocation(playSquares[0].location, direction);
  while (prevLocation !== null && anyTile(gameBoard[prevLocation])) {
    allSquares.unshift(gameBoard[prevLocation]);
    prevLocation = getPreviousLocation(prevLocation, direction);
  }
  // forward
  let nextLocation: number | null = playSquares[0].location;
  while (nextLocation !== null && anyTile(gameBoard[nextLocation])) {
    allSquares.push(gameBoard[nextLocation]);
    nextLocation = getNextLocation(nextLocation, direction);
  }
  return allSquares;
};

export const checkForInvalidWords = (
  playSquares: Square[],
  gameBoard: Square[],
  wordlist: WordList
): string[] => {
  // Find the direction that the play is headed in
  const direction = playDirection(playSquares);
  if (direction === null) {
    // We should already have checked for out-of-line plays
    throw new Error(
      "Logic error - checkForInvalidWords found out of line play"
    );
  }
  const invalidWords = [];

  //
  // [1] Check the primary word, in the direction it was played
  //
  const directional: Square[] = allSquaresInWord(
    playSquares,
    gameBoard,
    direction
  );

  if (directional.length === 0) {
    throw new Error(
      "Logic Error - directional play should not have zero length"
    );
  }

  // If word isn't in the dictionary, push it into return string array
  if (!squaresAreAValidWord(directional, wordlist)) {
    invalidWords.push(stringFromTiles(allTilesFromSquares(directional)));
  }

  //
  // [2] Check any other words the playSquares have created
  //
  // In the opposite direction, go through each of our play letters
  const oppositeDirection = direction === VERTICAL ? HORIZONTAL : VERTICAL;
  const orthogonal: Square[] = playSquares.filter((s) => {
    // Find each tile that touches another tile orthogonally
    const prev = getPreviousLocation(s.location, oppositeDirection);
    if (prev !== null && gameBoard[prev].tile) {
      return true;
    }
    const next = getNextLocation(s.location, oppositeDirection);
    if (next !== null && gameBoard[next].tile) {
      return true;
    }
    return false;
  });

  // For each of our play tiles that makes an orthogonal word
  orthogonal.forEach((square) => {
    const allSquares = allSquaresInWord([square], gameBoard, oppositeDirection);
    // Check the dictionary, and if word is invalid, return it
    if (!squaresAreAValidWord(allSquares, wordlist)) {
      invalidWords.push(stringFromTiles(allTilesFromSquares(allSquares)));
    }
  });

  return invalidWords;
};
