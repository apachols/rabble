import { stringFromTiles } from "./tileBag";

import {
  HORIZONTAL,
  VERTICAL,
  getNextLocation,
  getPreviousLocation,
  rowForLocation,
  columnForLocation,
  anyTile,
} from "./board";

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
    gameBoard[s.location].playTile = null;
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

export const locationHasTileAdjacentForDirection = (
  location: number,
  direction: Direction,
  gameBoard: Square[]
) =>
  [
    getPreviousLocation(location, direction),
    getNextLocation(location, direction),
  ].some((loc) => (loc !== null ? gameBoard[loc].tile : false));

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

export const playDirection = (
  playSquares: Square[],
  gameBoard: Square[]
): Direction => {
  const { location } = playSquares[0];
  const row = rowForLocation(location);
  const column = columnForLocation(location);
  // For length 1, we need to look at the board - are we next to tiles?
  if (playSquares.length === 1) {
    // TODO - checkword for 1 length play on first turn will return invalid direction, since no adjacency...
    const { location } = playSquares[0];
    if (locationHasTileAdjacentForDirection(location, HORIZONTAL, gameBoard)) {
      return HORIZONTAL;
    }
    if (locationHasTileAdjacentForDirection(location, VERTICAL, gameBoard)) {
      return VERTICAL;
    }
    return null;
  }
  // Greater than length 1, we can just see if all squares have the same row / column
  if (playSquares.every((s) => rowForLocation(s.location) === row)) {
    return HORIZONTAL;
  }
  if (playSquares.every((s) => columnForLocation(s.location) === column)) {
    return VERTICAL;
  }
  return null;
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
