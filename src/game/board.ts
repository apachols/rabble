export const HORIZONTAL = "H";
export const VERTICAL = "V";

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

export const getNextLocation = (
  location: number,
  direction: Direction
): number | null => {
  if (!direction) {
    return null;
  }
  if (direction === VERTICAL) {
    const next = location + 15;
    return next >= 225 ? null : next;
  }
  if (direction === HORIZONTAL) {
    const next = location + 1;
    if (next % 15 === (location % 15) + 1) {
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
