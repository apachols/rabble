export const MAX_PLAYER_RACK_TILES = 7;

export const tileBagConfig: TileBagConfig = {
  " ": { letter: " ", value: 0, blank: true, frequency: 2 },
  A: { letter: "A", value: 1, blank: false, frequency: 9 },
  B: { letter: "B", value: 3, blank: false, frequency: 2 },
  C: { letter: "C", value: 3, blank: false, frequency: 2 },
  D: { letter: "D", value: 2, blank: false, frequency: 4 },
  E: { letter: "E", value: 1, blank: false, frequency: 12 },
  F: { letter: "F", value: 4, blank: false, frequency: 2 },
  G: { letter: "G", value: 2, blank: false, frequency: 3 },
  H: { letter: "H", value: 4, blank: false, frequency: 2 },
  I: { letter: "I", value: 1, blank: false, frequency: 9 },
  J: { letter: "J", value: 8, blank: false, frequency: 1 },
  K: { letter: "K", value: 5, blank: false, frequency: 1 },
  L: { letter: "L", value: 1, blank: false, frequency: 4 },
  M: { letter: "M", value: 3, blank: false, frequency: 2 },
  N: { letter: "N", value: 1, blank: false, frequency: 6 },
  O: { letter: "O", value: 1, blank: false, frequency: 8 },
  P: { letter: "P", value: 3, blank: false, frequency: 2 },
  Q: { letter: "Q", value: 10, blank: false, frequency: 1 },
  R: { letter: "R", value: 1, blank: false, frequency: 6 },
  S: { letter: "S", value: 1, blank: false, frequency: 4 },
  T: { letter: "T", value: 1, blank: false, frequency: 6 },
  U: { letter: "U", value: 1, blank: false, frequency: 4 },
  V: { letter: "V", value: 4, blank: false, frequency: 2 },
  W: { letter: "W", value: 4, blank: false, frequency: 2 },
  X: { letter: "X", value: 8, blank: false, frequency: 1 },
  Y: { letter: "Y", value: 4, blank: false, frequency: 2 },
  Z: { letter: "Z", value: 10, blank: false, frequency: 1 },
};

// Creates copies of the tiles, preventing tileBagConfig refs from leaking
export const createTiles = (tileClass: TileClass): Tile[] => {
  return Array(tileClass.frequency).fill({
    letter: tileClass.letter,
    value: tileClass.value,
    blank: tileClass.blank,
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
    .map((letter) => config[letter])
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
};

// play is valid if playLetters are a subset of rackLetters (which may have duplicates)
export const checkForPlayTilesInRack = (word: Tile[], rackTiles: Tile[]) => {
  const playLetters = [...word];
  if (!playLetters.length) {
    return false;
  }
  const rackLetters = rackTiles.map((t) => t.letter).sort();
  playLetters.sort();
  return playLetters.every(({ letter, blank }) => {
    const pos = rackLetters.indexOf(blank ? " " : letter);
    if (pos === -1) {
      return false;
    }
    rackLetters.splice(pos, 1);
    return true;
  });
};

export const stringFromTiles = (tiles: Tile[]) =>
  tiles.map((t) => t.letter).join("");

export const tilesFromString = (word: string): Tile[] => {
  const playLetters = word.toUpperCase().split("");
  if (!playLetters.every((letter) => tileBagConfig[letter])) {
    throw new Error(`Invalid word: '${word}'`);
  }
  return playLetters.map((letter) => ({
    letter,
    value: tileBagConfig[letter].value,
    blank: tileBagConfig[letter].blank,
  }));
};

// Used in the blank chooser
export const alphabetTiles = tilesFromString("abcdefghijklmnopqrstuvwxyz");

export const pullPlayTilesFromRack = (
  word: Tile[],
  tileRack: Tile[]
): Tile[] => {
  const rackLetters = tileRack.map((t) => t.letter);
  // for each letter in the play, find the position in rackLetters
  // and remove it from tileRack and rackLetters
  return word.map(({ letter, blank }) => {
    const pos = rackLetters.indexOf(blank ? " " : letter);
    if (pos === -1) {
      throw new Error(`Invalid play: '${letter}' not found`);
    }
    rackLetters.splice(pos, 1);
    return tileRack.splice(pos, 1)[0];
  });
};

// Takes in a tile array and returns an exchanged tile array and sorts the bag
export const exchangeTiles = (bag: Tile[], rack: Tile[], exchange: Tile[]) => {
  let rackLetters = rack.map((t) => t.letter);
  let exchangeLetters = exchange.map((t) => (t.blank ? " " : t.letter));

  for (let II = 0; II < exchange.length; II++) {
    console.log("finding", exchangeLetters[II]);
    const pos = rackLetters.indexOf(exchangeLetters[II]);
    if (pos !== -1) {
      console.log("found", pos);
      rackLetters.splice(pos, 1);
      const spliced = rack.splice(pos, 1);
      if (!spliced.length) {
        throw new Error(
          `exchangeTiles logic error - found but did not find...`
        );
      }
    } else {
      throw new Error(
        `Exchange tile not found! Letter = '${rackLetters[pos]}'`
      );
    }
  }

  drawTiles(rack, bag);
  exchange.forEach((t) => {
    bag.push({
      ...t,
      letter: t.blank ? " " : t.letter,
    });
  });
  shuffleTiles(bag);
  return;
};
