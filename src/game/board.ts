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

export const letterMultiplierForBonus = (bonus: string | null) => {
  if (bonus?.includes("L")) {
    return Number(bonus[1]);
  }
  return 1;
};

export const wordMultiplierForBonus = (bonus: string | null) => {
  if (bonus?.includes("W")) {
    return Number(bonus[1]);
  }
  return 1;
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

export const getDistance = (
  source: number,
  destination: number,
  direction: Direction
): number | number | null => {
  if (!direction || source === null || destination === null) {
    return null;
  }
  if (source < 0 || source > 224 || destination < 0 || destination > 224 ) {
    return null;
  }
  if (direction === VERTICAL) {
    return Math.round((destination - source) / 15);
  }
  if (direction === HORIZONTAL) {
    return destination - source;
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
