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

export const generateBoard = () => {
  const Board: Square[] = [];

  for (let XX = 0; XX < 225; XX++) {
    const tempSquare: Square = {
      location: XX,
      bonus: null,
      tile: null,
      selection: null,
    };
    if (bonusConfig["W3"].includes(XX)) {
      tempSquare.bonus = "W3";
    }
    if (bonusConfig["W2"].includes(XX)) {
      tempSquare.bonus = "W2";
    }
    if (bonusConfig["L3"].includes(XX)) {
      tempSquare.bonus = "L3";
    }
    if (bonusConfig["L2"].includes(XX)) {
      tempSquare.bonus = "L2";
    }
    Board.push(tempSquare);
  }
  return Board;
};
