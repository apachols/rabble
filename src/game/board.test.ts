import {
  getPreviousLocation,
  getNextLocation,
  HORIZONTAL,
  VERTICAL,
  allSquaresInWord,
  playDirection,
  layTiles,
  generateBoard,
  allTilesFromSquares,
  squaresAreAValidWord,
  finalizePlayOnBoard,
  allWordsForPlay,
} from "./board";
import { tilesFromString, stringFromTiles } from "./tileBag";

describe("getPreviousLocation", () => {
  it.each`
    location | direction     | result
    ${0}     | ${HORIZONTAL} | ${null}
    ${1}     | ${HORIZONTAL} | ${0}
    ${14}    | ${HORIZONTAL} | ${13}
    ${15}    | ${HORIZONTAL} | ${null}
    ${0}     | ${VERTICAL}   | ${null}
    ${14}    | ${VERTICAL}   | ${null}
    ${15}    | ${VERTICAL}   | ${0}
    ${224}   | ${VERTICAL}   | ${209}
  `("provides correct previous location", ({ location, direction, result }) => {
    expect(getPreviousLocation(location, direction)).toEqual(result);
  });
  it.each`
    location | direction     | result
    ${0}     | ${null}       | ${null}
    ${-1}    | ${HORIZONTAL} | ${null}
    ${225}   | ${HORIZONTAL} | ${null}
    ${-1}    | ${VERTICAL}   | ${null}
    ${225}   | ${VERTICAL}   | ${null}
  `("provides bounds checking", ({ location, direction, result }) => {
    expect(getPreviousLocation(location, direction)).toEqual(result);
  });
});

describe("getNextLocation", () => {
  it.each`
    location | direction     | result
    ${0}     | ${HORIZONTAL} | ${1}
    ${14}    | ${HORIZONTAL} | ${null}
    ${15}    | ${HORIZONTAL} | ${16}
    ${224}   | ${HORIZONTAL} | ${null}
    ${0}     | ${VERTICAL}   | ${15}
    ${14}    | ${VERTICAL}   | ${29}
    ${210}   | ${VERTICAL}   | ${null}
    ${224}   | ${VERTICAL}   | ${null}
  `("provides correct next location", ({ location, direction, result }) => {
    expect(getNextLocation(location, direction)).toEqual(result);
  });
  it.each`
    location | direction     | result
    ${0}     | ${null}       | ${null}
    ${-1}    | ${HORIZONTAL} | ${null}
    ${225}   | ${HORIZONTAL} | ${null}
    ${-1}    | ${VERTICAL}   | ${null}
    ${225}   | ${VERTICAL}   | ${null}
  `("provides bounds checking", ({ location, direction, result }) => {
    expect(getNextLocation(location, direction)).toEqual(result);
  });
});

describe("layTiles", () => {
  let location: number | null = 0;
  let board: Square[];
  let toPlay: Tile[] = [];
  let direction: Direction = null;
  let callback: any;
  beforeEach(() => {
    board = generateBoard();
    direction = VERTICAL;
    toPlay = tilesFromString("RABBLE");
    location = 0;
    callback = jest.fn(() => {});
  });
  it("returns if location is null", () => {
    layTiles({ board, direction, toPlay, location: null, callback });
    expect(board.filter((s) => s.playTile).length).toBe(0);
    expect(callback.mock.calls.length).toBe(0);
  });
  it("returns if direction is null", () => {
    layTiles({ board, direction: null, toPlay, location, callback });
    expect(board.filter((s) => s.playTile).length).toBe(0);
    expect(callback.mock.calls.length).toBe(0);
  });
  it("returns if no more tiles to play", () => {
    layTiles({ board, direction, toPlay: [], location, callback });
    expect(board.filter((s) => s.playTile).length).toBe(0);
    expect(callback.mock.calls.length).toBe(0);
  });
  it("callback early without laying a tile if square has tile", () => {
    board[0].tile = tilesFromString("Q")[0];
    layTiles({ board, direction, toPlay, location, callback });
    expect(board.filter((s) => s.playTile).length).toBe(0);
    expect(callback.mock.calls.length).toBe(1);
  });
  it("lays a tile if possible", () => {
    layTiles({ board, direction, toPlay, location, callback });
    expect(board.filter((s) => s.playTile).length).toBe(1);
    expect(callback.mock.calls.length).toBe(1);
  });
  it("lays all tiles if possible", () => {
    layTiles({ board, direction, toPlay, location, callback: layTiles });
    expect(board.filter((s) => s.playTile).length).toBe(6);
  });
});

describe("playDirection", () => {
  let location: number | null = 0;
  let board: Square[];
  let toPlay: Tile[] = [];
  beforeEach(() => {
    board = generateBoard();
    toPlay = tilesFromString("RABBLE");
    location = 0;
  });
  it("finds a vertical play", () => {
    layTiles({
      board,
      direction: VERTICAL,
      toPlay,
      location: 0,
      callback: layTiles,
    });
    const playSquares = board.filter((s) => s.playTile);
    expect(playSquares.length).toBe(6);
    expect(playDirection(playSquares)).toBe(VERTICAL);
  });
  it("finds a horizontal play", () => {
    layTiles({
      board,
      direction: HORIZONTAL,
      toPlay,
      location: 0,
      callback: layTiles,
    });
    const playSquares = board.filter((s) => s.playTile);
    expect(playSquares.length).toBe(6);
    expect(playDirection(playSquares)).toBe(HORIZONTAL);
  });
  it("finds an illegal play", () => {
    layTiles({
      board,
      direction: VERTICAL,
      toPlay,
      location: 0,
      callback: layTiles,
    });
    layTiles({
      board,
      direction: HORIZONTAL,
      toPlay,
      location: 1,
      callback: layTiles,
    });
    const playSquares = board.filter((s) => s.playTile);
    expect(playSquares.length).toBe(12);
    expect(playDirection(playSquares)).toBe(null);
  });
  it("returns horizontal for length 1", () => {
    layTiles({
      board,
      direction: VERTICAL,
      toPlay: tilesFromString("Q"),
      location: 0,
      callback: layTiles,
    });
    const playSquares = board.filter((s) => s.playTile);
    expect(playSquares.length).toBe(1);
    expect(playDirection(playSquares)).toBe(HORIZONTAL);
  });
});

describe("allSquaresInWord", () => {
  let board: Square[];
  let layTilesArgs: any;
  beforeEach(() => {
    board = generateBoard();
    layTilesArgs = { board, callback: layTiles };
  });
  it("finds a tile at the beginning of the word", () => {
    layTiles({
      ...layTilesArgs,
      direction: VERTICAL,
      location: 0,
      toPlay: tilesFromString("EAT"),
    });
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 1,
      toPlay: tilesFromString("ASY"),
    });
    const word = board.slice(1, 4);
    const squares = allSquaresInWord(word, board, HORIZONTAL);
    expect(squares.length).toBe(4);
    expect(stringFromTiles(allTilesFromSquares(squares))).toBe("EASY");
  });
  it("finds a tile at the beginning of the word", () => {
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("EAT"),
    });
    layTiles({
      ...layTilesArgs,
      direction: VERTICAL,
      location: 3,
      toPlay: tilesFromString("SIT"),
    });
    const word = board.slice(0, 3);
    const squares = allSquaresInWord(word, board, HORIZONTAL);
    expect(squares.length).toBe(4);
    expect(stringFromTiles(allTilesFromSquares(squares))).toBe("EATS");
  });
  it("finds a two letter word", () => {
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("EAT"),
    });
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 15,
      toPlay: tilesFromString("SEA"),
    });
    const word = [board[1]];
    const squares = allSquaresInWord(word, board, VERTICAL);
    expect(squares.length).toBe(2);
    expect(stringFromTiles(allTilesFromSquares(squares))).toBe("AE");
  });
  it("goes forward and backward", () => {
    layTiles({
      ...layTilesArgs,
      direction: VERTICAL,
      location: 0,
      toPlay: tilesFromString("SEAT"),
    });
    layTiles({
      ...layTilesArgs,
      direction: VERTICAL,
      location: 2,
      toPlay: tilesFromString("PEAS"),
    });
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 1,
      toPlay: tilesFromString("I"),
    });
    const word = [board[1]];
    const squares = allSquaresInWord(word, board, HORIZONTAL);
    expect(squares.length).toBe(3);
    expect(stringFromTiles(allTilesFromSquares(squares))).toBe("SIP");
  });
  it("works non-contiguously", () => {
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("F"),
    });
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 15,
      toPlay: tilesFromString("ERA"),
    });
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 30,
      toPlay: tilesFromString("N"),
    });
    const word = [board[15]];
    const squares = allSquaresInWord(word, board, VERTICAL);
    expect(squares.length).toBe(3);
    expect(stringFromTiles(allTilesFromSquares(squares))).toBe("FEN");
  });
});

describe("squaresAreAValidWord", () => {
  let board: Square[];
  let layTilesArgs: any;
  beforeEach(() => {
    board = generateBoard();
    layTilesArgs = { board, callback: layTiles };
  });
  it("returns true for word in the dictionary", () => {
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("ZYZZYVA"),
    });
    const wordlist = {
      ZYZZYVA: 1,
    };
    const squares = allSquaresInWord([board[0]], board, HORIZONTAL);
    expect(squares.length).toBe(7);
    expect(squaresAreAValidWord(squares, wordlist)).toBe(true);
  });
  it("returns false for word not in the dictionary", () => {
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("ZYZZYVA"),
    });
    const wordlist = {
      FESTIVUS: 1,
    };
    const squares = allSquaresInWord([board[0]], board, HORIZONTAL);
    expect(squares.length).toBe(7);
    expect(squaresAreAValidWord(squares, wordlist)).toBe(false);
  });
});

describe("allWordsForPlay", () => {
  let board: Square[];
  let layTilesArgs: any;
  let wordlist: WordList;
  beforeEach(() => {
    board = generateBoard();
    layTilesArgs = { board, callback: layTiles };
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("RESET"),
    });
    layTiles({
      ...layTilesArgs,
      direction: VERTICAL,
      location: 17,
      toPlay: tilesFromString("ETTER"),
    });
    finalizePlayOnBoard(board, board);
    wordlist = {
      RESET: 1,
      SETTER: 1,
    };
  });
  it("returns empty array if all words valid", () => {
    board[15].tile = tilesFromString("E")[0];
    board[16].tile = tilesFromString("R")[0];
    const playSquares = [board[15], board[16]];
    const allWords = allWordsForPlay(playSquares, board);
    expect(allWords.length).toBe(3);
  });
  it("find valid words for non-contiguous play", () => {
    board[16].tile = tilesFromString("T")[0];
    board[18].tile = tilesFromString("T")[0];
    board[19].tile = tilesFromString("E")[0];
    const playSquares = [board[16], board[18], board[19]];
    const allWords = allWordsForPlay(playSquares, board);
    expect(allWords.length).toBe(4);
  });
});
