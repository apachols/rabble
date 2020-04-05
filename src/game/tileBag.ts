const MAX_PLAYER_RACK_TILES = 7;

const tileBagConfig: Array<TileClass> = [
  { tile: { letter: "", value: 0 }, frequency: 2 },
  { tile: { letter: "A", value: 1 }, frequency: 9 },
  { tile: { letter: "B", value: 3 }, frequency: 2 },
  { tile: { letter: "C", value: 3 }, frequency: 2 },
  { tile: { letter: "D", value: 2 }, frequency: 4 },
  { tile: { letter: "E", value: 1 }, frequency: 12 },
  { tile: { letter: "F", value: 4 }, frequency: 2 },
  { tile: { letter: "G", value: 2 }, frequency: 3 },
  { tile: { letter: "H", value: 4 }, frequency: 2 },
  { tile: { letter: "I", value: 1 }, frequency: 9 },
  { tile: { letter: "J", value: 8 }, frequency: 1 },
  { tile: { letter: "K", value: 5 }, frequency: 1 },
  { tile: { letter: "L", value: 1 }, frequency: 4 },
  { tile: { letter: "M", value: 3 }, frequency: 2 },
  { tile: { letter: "N", value: 1 }, frequency: 6 },
  { tile: { letter: "O", value: 1 }, frequency: 8 },
  { tile: { letter: "P", value: 3 }, frequency: 2 },
  { tile: { letter: "Q", value: 10 }, frequency: 1 },
  { tile: { letter: "R", value: 1 }, frequency: 6 },
  { tile: { letter: "S", value: 1 }, frequency: 4 },
  { tile: { letter: "T", value: 1 }, frequency: 6 },
  { tile: { letter: "U", value: 1 }, frequency: 4 },
  { tile: { letter: "V", value: 4 }, frequency: 2 },
  { tile: { letter: "W", value: 4 }, frequency: 2 },
  { tile: { letter: "X", value: 8 }, frequency: 1 },
  { tile: { letter: "Y", value: 4 }, frequency: 2 },
  { tile: { letter: "Z", value: 10 }, frequency: 1 }
];

// Creates copies of the tiles, preventing tileBagConfig refs from leaking
const createTiles = (tileClass: TileClass): Tile[] => {
  return Array(tileClass.frequency).fill({ ...tileClass.tile });
};

export const createTileBag = (
  config: Array<TileClass> = tileBagConfig
): Tile[] => {
  const reducer = (bag: Tile[], tileClass: TileClass) => {
    bag.push(...createTiles(tileClass));
    return bag;
  };
  return config.reduce(reducer, []);
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
