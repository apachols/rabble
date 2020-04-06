const MAX_PLAYER_RACK_TILES = 7;

type TileBagConfig = {
  [key: string]: {
    letter: string;
    value: number;
    frequency: number;
  };
};

const tileBagConfig: TileBagConfig = {
  " ": { letter: " ", value: 0, frequency: 2 },
  A: { letter: "A", value: 1, frequency: 9 },
  B: { letter: "B", value: 3, frequency: 2 },
  C: { letter: "C", value: 3, frequency: 2 },
  D: { letter: "D", value: 2, frequency: 4 },
  E: { letter: "E", value: 1, frequency: 12 },
  F: { letter: "F", value: 4, frequency: 2 },
  G: { letter: "G", value: 2, frequency: 3 },
  H: { letter: "H", value: 4, frequency: 2 },
  I: { letter: "I", value: 1, frequency: 9 },
  J: { letter: "J", value: 8, frequency: 1 },
  K: { letter: "K", value: 5, frequency: 1 },
  L: { letter: "L", value: 1, frequency: 4 },
  M: { letter: "M", value: 3, frequency: 2 },
  N: { letter: "N", value: 1, frequency: 6 },
  O: { letter: "O", value: 1, frequency: 8 },
  P: { letter: "P", value: 3, frequency: 2 },
  Q: { letter: "Q", value: 10, frequency: 1 },
  R: { letter: "R", value: 1, frequency: 6 },
  S: { letter: "S", value: 1, frequency: 4 },
  T: { letter: "T", value: 1, frequency: 6 },
  U: { letter: "U", value: 1, frequency: 4 },
  V: { letter: "V", value: 4, frequency: 2 },
  W: { letter: "W", value: 4, frequency: 2 },
  X: { letter: "X", value: 8, frequency: 1 },
  Y: { letter: "Y", value: 4, frequency: 2 },
  Z: { letter: "Z", value: 10, frequency: 1 }
};

// Creates copies of the tiles, preventing tileBagConfig refs from leaking
const createTiles = (tileClass: TileClass): Tile[] => {
  return Array(tileClass.frequency).fill({
    letter: tileClass.letter,
    value: tileClass.value
  });
};

export const createTileBag = (
  config: TileBagConfig = tileBagConfig
): Tile[] => {
  const reducer = (bag: Tile[], tileClass: TileClass) => {
    bag.push(...createTiles(tileClass));
    return bag;
  };
  return Object.keys(config)
    .map(letter => config[letter])
    .reduce(reducer, []);
};

export const shuffleTiles = (tiles: Tile[]) => {
  tiles.sort(() => 0.5 - Math.random());
  return tiles;
};

// Mutate both tileRack and tileBag to draw up to MAX_PLAYER_RACK_TILES
export const drawTiles = (tileRack: Tile[], tileBag: Tile[]) => {
  const howManyTiles = MAX_PLAYER_RACK_TILES - tileRack.length;

  for (let ii = 0; ii < howManyTiles; ii++) {
    const tile = tileBag.pop();
    if (tile) {
      tileRack.push(tile);
    }
  }
  return tileRack;
};

// play is valid if playLetters are a subset of rackLetters (which may have duplicates)
export const playIsValid = (word: string, rackTiles: Tile[]) => {
  const playLetters = word.toUpperCase().split("");
  if (!playLetters.length) {
    return false;
  }
  const rackLetters = rackTiles.map(t => t.letter).sort();
  playLetters.sort();
  return playLetters.every(letter => {
    const pos = rackLetters.indexOf(letter);
    if (pos === -1) {
      return false;
    }
    rackLetters.splice(pos, 1);
    return true;
  });
};

// Assumes word contains only valid letters
export const tilesFromString = (word: string): Tile[] => {
  const playLetters = word.toUpperCase().split("");
  return playLetters.map(letter => ({
    letter,
    value: tileBagConfig[letter].value
  }));
};

// Assumes tileRack already has all the letters in the word
export const pullPlayTilesFromRack = (
  word: string,
  tileRack: Tile[]
): Tile[] => {
  const playLetters = word.toUpperCase().split("");
  const rackLetters = tileRack.map(t => t.letter);
  // for each letter in the play, find the position in rackLetters
  // and remove it from tileRack and rackLetters
  return playLetters.map(letter => {
    const pos = rackLetters.indexOf(letter);
    rackLetters.splice(pos, 1);
    return tileRack.splice(pos, 1)[0];
  });
};
