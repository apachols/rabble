const W3_BONUS = 0;
const W2_BONUS = 1;
const L3_BONUS = 2;
const L2_BONUS = 3;

export const bonusConfig: Bonus[] = [
  { bonus: "W3", locations: [0, 7, 14, 105, 119, 210, 217, 224] },
  {
    bonus: "W2",
    locations: [
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
  },
  {
    bonus: "L3",
    locations: [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204],
  },
  {
    bonus: "L2",
    locations: [
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
  },
];

export const generateBoard = () => {
  const Board: Square[] = [];

  for (let XX = 0; XX < 225; XX++) {
    let tempSquare: Square = {
      bonus: null,
      location: XX,
      tile: null,
    };

    if (bonusConfig[W3_BONUS].locations.indexOf(XX) !== -1) {
      tempSquare = {
        bonus: "W3",
        location: XX,
        tile: null,
      };
    }
    if (bonusConfig[W2_BONUS].locations.indexOf(XX) !== -1) {
      tempSquare = {
        bonus: "W2",
        location: XX,
        tile: null,
      };
    }

    if (bonusConfig[L3_BONUS].locations.indexOf(XX) !== -1) {
      tempSquare = {
        bonus: "L3",
        location: XX,
        tile: null,
      };
    }

    if (bonusConfig[L2_BONUS].locations.indexOf(XX) !== -1) {
      tempSquare = {
        bonus: "L2",
        location: XX,
        tile: null,
      };
    }
    Board.push(tempSquare);
  }
  return Board;
};
