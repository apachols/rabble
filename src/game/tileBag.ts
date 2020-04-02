type Tile = {
  letter: string;
  value: number;
};

type TileClass = {
  tile: Tile;
  frequency: number;
};

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

const createTiles = (tileClass: TileClass): Array<Tile> => {
  return Array(tileClass.frequency).fill({ ...tileClass.tile });
};

export const createTileBag = (
  config: Array<TileClass> = tileBagConfig
): Array<Tile> => {
  const reducer = (bag: Array<Tile>, tileClass: TileClass) => {
    bag.push(...createTiles(tileClass));
    return bag;
  };
  return config.reduce(reducer, []);
};

export const shuffleTileBag = (tileBag: Array<Tile>) => {
  tileBag.sort(() => 0.5 - Math.random());
};
