import {
  tileBagConfig,
  createTiles,
  createTileBag,
  drawTiles,
  checkForPlayTilesInRack,
  MAX_PLAYER_RACK_TILES,
  tilesFromString,
  pullPlayTilesFromRack,
} from "./tileBag";
import { create } from "domain";

describe("createTiles", () => {
  it("creates tiles", () => {
    const tclass: TileClass = {
      letter: "A",
      value: 1,
      frequency: 9,
      blank: false,
    };

    const tiles = createTiles(tclass);

    expect(tiles.length).toEqual(9);
    expect(tiles.every((t) => t.letter === "A")).toBeTruthy();
    expect(tiles.every((t) => t.blank)).toBeFalsy();
  });
});

describe("createTileBag", () => {
  const config: TileBagConfig = {
    " ": { blank: true, letter: " ", value: 0, frequency: 2 },
    A: { blank: false, letter: "A", value: 1, frequency: 9 },
    B: { blank: false, letter: "B", value: 3, frequency: 2 },
  };

  it("creates tiles according to config", () => {
    const bag = createTileBag(config);

    expect(bag.length).toEqual(13);
    expect(bag.filter((t) => t.letter === "A").length).toEqual(9);
    expect(bag.filter((t) => t.letter === " ").length).toEqual(2);
    const bs = bag.filter((t) => t.letter === "B");
    expect(bs.reduce((a, b) => a + b.value, 0)).toEqual(6);
  });
});

describe("shuffleTiles", () => {
  // bad ROI on tests for this pseudorandom function until it gets more complicated
});

describe("drawTiles", () => {
  let fullBag: Tile[] = [];
  let fullRackBeforeDraw: Tile[] = [];

  beforeEach(() => {
    fullBag = createTileBag(tileBagConfig);
    fullRackBeforeDraw = "AEIOUTS"
      .split("")
      .map((l) => ({ letter: l, value: 1, blank: false }));
  });

  it("draws an empty hand to MAX_PLAYER_RACK_TILES tiles", () => {
    const tileRack: Tile[] = [];
    drawTiles(tileRack, fullBag);
    expect(tileRack.length).toBe(MAX_PLAYER_RACK_TILES);
    expect(fullBag.length).toBe(100 - MAX_PLAYER_RACK_TILES);
  });

  it("draws against a full hand without moving any tiles", () => {
    drawTiles(fullRackBeforeDraw, fullBag);
    expect(fullBag.length).toBe(100);
    expect(fullRackBeforeDraw.map((t) => t.letter).join("")).toEqual("AEIOUTS");
  });

  it("draws the bag to empty with enough letters", () => {
    const config: TileBagConfig = {
      A: { letter: "A", value: 1, frequency: 2, blank: false },
      B: { letter: "B", value: 3, frequency: 2, blank: false },
    };
    const halfEmpty = createTileBag(config);
    const rack = "UTS"
      .split("")
      .map((l) => ({ letter: l, value: 1, blank: false }));
    drawTiles(rack, halfEmpty);
    expect(halfEmpty.length).toBe(0);
    expect(rack.length).toBe(MAX_PLAYER_RACK_TILES);
  });

  it("draws the bag to empty without enough letters", () => {
    const config: TileBagConfig = {
      A: { letter: "A", value: 1, frequency: 1, blank: false },
      B: { letter: "B", value: 3, frequency: 1, blank: false },
    };
    const halfEmpty = createTileBag(config);
    const rack = "UTS"
      .split("")
      .map((l) => ({ letter: l, value: 1, blank: false }));
    drawTiles(rack, halfEmpty);
    expect(halfEmpty.length).toBe(0);
    expect(rack.length).toBe(5);
  });
});

describe("checkForPlayTilesInRack", () => {
  it.each`
    wordString   | rackLetters  | result
    ${"test"}    | ${"TESTERS"} | ${true}
    ${"lass"}    | ${"SSSLASS"} | ${true}
    ${"ss"}      | ${"TESTERS"} | ${true}
    ${"set"}     | ${"LEST"}    | ${true}
    ${"retests"} | ${"TESTERS"} | ${true}
    ${"retests"} | ${"TTSSRE"}  | ${false}
    ${"LANAI"}   | ${"TESTERS"} | ${false}
    ${""}        | ${"TESTERS"} | ${false}
  `("returns true for valid", ({ wordString, rackLetters, result }) => {
    const rack = rackLetters
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: false }));
    expect(checkForPlayTilesInRack(tilesFromString(wordString), rack)).toEqual(
      result
    );
  });
  it.each`
    wordString | rackLetters  | result
    ${"test"}  | ${"TESTER "} | ${true}
    ${"testy"} | ${"TESTER "} | ${false}
  `(
    "returns true for valid with blank",
    ({ wordString, rackLetters, result }) => {
      const rack = rackLetters.split("").map((l: string) => ({
        letter: l,
        value: l === " " ? 0 : 1,
        blank: l === " ",
      }));
      const wordTiles = tilesFromString(wordString);
      wordTiles.push({ letter: "Y", value: 0, blank: true });
      expect(checkForPlayTilesInRack(wordTiles, rack)).toEqual(result);
    }
  );
});

describe("tilesFromString", () => {
  it("creates tiles from a string", () => {
    // Assumes a US-EN tileBagConfig
    const tiles: Tile[] = tilesFromString("LANTERN");
    expect(tiles.length).toEqual(7);
    expect(tiles.reduce((a, b) => a + b.value, 0)).toEqual(7);
  });
  it("creates throws an error for an invalid string", () => {
    try {
      tilesFromString("0987654321");
    } catch (err) {
      expect(err.message).toEqual("Invalid word: '0987654321'");
    }
  });
});

describe("pullPlayTilesFromRack", () => {
  it.each`
    wordString   | rackLetters  | result
    ${"test"}    | ${"TESTERS"} | ${true}
    ${"lass"}    | ${"SSSLASS"} | ${true}
    ${"ss"}      | ${"TESTERS"} | ${true}
    ${"set"}     | ${"LEST"}    | ${true}
    ${"retests"} | ${"TESTERS"} | ${true}
  `(
    "returns true for valid play without blanks",
    ({ wordString, rackLetters, result }) => {
      const rack = rackLetters
        .split("")
        .map((l: string) => ({ letter: l, value: 1 }));
      const tiles = pullPlayTilesFromRack(tilesFromString(wordString), rack);
      expect(tiles.length).toEqual(wordString.length);
      expect(tiles.map((t) => t.letter).join("")).toEqual(
        wordString.toUpperCase()
      );
    }
  );
  it("returns true for valid play with blanks", () => {
    const rack = "RETEST "
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: l === " " }));
    const playTiles = "RETEST"
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: l === " " }));
    playTiles.push({ letter: "S", value: 0, blank: true });
    const tiles = pullPlayTilesFromRack(playTiles, rack);
    expect(tiles.length).toBe(7);
  });
  it("returns true for valid play with 2 blanks", () => {
    const rack = "RETES  "
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: l === " " }));
    const playTiles = "RETES"
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: l === " " }));
    playTiles.push({ letter: "K", value: 0, blank: true });
    playTiles.push({ letter: "Y", value: 0, blank: true });
    const tiles = pullPlayTilesFromRack(playTiles, rack);
    expect(tiles.length).toBe(7);
  });
  it("returns true for valid play with 2 blanks and repeats", () => {
    const rack = "BANA  S"
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: l === " " }));
    const playTiles = "BANA"
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: l === " " }));
    playTiles.push({ letter: "N", value: 0, blank: true });
    playTiles.push({ letter: "A", value: 0, blank: true });
    playTiles.push({ letter: "S", value: 1, blank: false });
    const tiles = pullPlayTilesFromRack(playTiles, rack);
    expect(tiles.length).toBe(7);
  });
  it("throws for invalid play with blanks", () => {
    const rack = "BANA  S"
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: l === " " }));
    const playTiles = "BANA"
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: l === " " }));
    playTiles.push({ letter: "N", value: 0, blank: true });
    playTiles.push({ letter: "A", value: 0, blank: true });
    playTiles.push({ letter: "Z", value: 1, blank: false });
    try {
      pullPlayTilesFromRack(playTiles, rack);
    } catch (err) {
      expect(err.message).toEqual("Invalid play: 'Z' not found");
    }
  });
  it("throws error for invalid", () => {
    const rack = "IIIIIII"
      .split("")
      .map((l: string) => ({ letter: l, value: 1, blank: false }));
    try {
      pullPlayTilesFromRack(tilesFromString("NOPE"), rack);
    } catch (err) {
      expect(err.message).toEqual("Invalid play: 'N' not found");
    }
  });
});
