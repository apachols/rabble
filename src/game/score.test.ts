import { HORIZONTAL, VERTICAL, generateBoard } from "./board";
import { allSquaresInWord, layTiles, finalizePlayOnBoard } from "./play";
import {
  allWordsForPlay,
  scoreForSquare,
  wordBonusesForWord,
  scoreForWord,
  scoreForValidWords,
  checkForInvalidWords,
} from "./score";
import { tilesFromString } from "./tileBag";

describe("allWordsForPlay", () => {
  let board: Square[];
  let layTilesArgs: any;
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
  });
  it("returns empty array if all words valid", () => {
    board[15].tile = tilesFromString("E")[0];
    board[16].tile = tilesFromString("R")[0];
    const playSquares = [board[15], board[16]];
    const allWords = allWordsForPlay(playSquares, board);
    expect(allWords.length).toBe(3);
  });
  it("finds valid words for non-contiguous play", () => {
    board[16].tile = tilesFromString("T")[0];
    board[18].tile = tilesFromString("T")[0];
    board[19].tile = tilesFromString("E")[0];
    const playSquares = [board[16], board[18], board[19]];
    const allWords = allWordsForPlay(playSquares, board);
    expect(allWords.length).toBe(4);
  });
});

describe("scoreForSquare", () => {
  const square: Square = {
    location: 0,
    bonus: null,
    tile: null,
    playTile: null,
  };
  it("throws if no tile or playtile", () => {
    expect(() => scoreForSquare(square)).toThrow();
  });
  it("returns tile value if tile", () => {
    const tile = tilesFromString("A")[0];
    expect(scoreForSquare({ ...square, tile })).toBe(1);
  });
  it("returns playTile value when no bonus", () => {
    const playTile = tilesFromString("Z")[0];
    expect(scoreForSquare({ ...square, playTile })).toBe(10);
  });
  it("returns playTile value when word bonus", () => {
    const playTile = tilesFromString("Z")[0];
    expect(scoreForSquare({ ...square, playTile, bonus: "W3" })).toBe(10);
  });
  it("returns multiplied playTile value when letter bonus", () => {
    const playTile = tilesFromString("Z")[0];
    expect(scoreForSquare({ ...square, playTile, bonus: "L2" })).toBe(20);
  });
});

describe("wordBonusesForWord", () => {
  let board: Square[];
  let layTilesArgs: any;
  beforeEach(() => {
    board = generateBoard();
    layTilesArgs = { board, callback: layTiles };
  });
  it("returns a word but not a letter bonus", () => {
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("RABBITS"),
    });
    const bonuses = wordBonusesForWord(board.slice(0, 6));
    expect(bonuses).toEqual([3]);
  });
  it("will not reuse a word bonus from a previous turn's tile", () => {
    layTiles({
      ...layTilesArgs,
      direction: VERTICAL,
      location: 0,
      toPlay: tilesFromString("RUN"),
    });
    finalizePlayOnBoard(board, board);
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 1,
      toPlay: tilesFromString("ABBITS"),
    });
    const bonuses = wordBonusesForWord(board.slice(0, 6));
    expect(bonuses).toEqual([]);
  });
  it("returns 2 word bonuses", () => {
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 64,
      toPlay: tilesFromString("RABBLES"),
    });
    const bonuses = wordBonusesForWord(board.slice(64, 71));
    expect(bonuses).toEqual([2, 2]);
  });
});

describe("scoreForWord", () => {
  let board: Square[];
  let layTilesArgs: any;
  beforeEach(() => {
    board = generateBoard();
    layTilesArgs = { board, callback: layTiles };
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("FAR"),
    });
    finalizePlayOnBoard(board, board);
  });
  it.each`
    location | score | direction     | word
    ${112}   | ${18} | ${HORIZONTAL} | ${"SCORES"}
    ${64}    | ${90} | ${HORIZONTAL} | ${"SCORING"}
  `(
    "calculates correct score for new play",
    ({ location, score, direction, word }) => {
      const toPlay = tilesFromString(word);
      layTiles({
        ...layTilesArgs,
        direction,
        location,
        toPlay,
      });
      const playSquares = board.slice(location, location + word.length);
      expect(scoreForWord(playSquares)).toBe(score);
    }
  );
  it.each`
    location | score | direction     | word
    ${3}     | ${14} | ${HORIZONTAL} | ${"THER"}
    ${3}     | ${9}  | ${HORIZONTAL} | ${" ED"}
    ${15}    | ${8}  | ${VERTICAL}   | ${"EAR"}
    ${15}    | ${92} | ${VERTICAL}   | ${"ANATICS"}
  `(
    "does not re-count bonuses played during previous turns",
    ({ location, score, direction, word }) => {
      const toPlay = tilesFromString(word);
      layTiles({
        ...layTilesArgs,
        direction,
        location,
        toPlay,
      });
      const laidTiles = board.slice(location, location + word.length);
      const playSquares = allSquaresInWord(laidTiles, board, direction);
      expect(scoreForWord(playSquares)).toBe(score);
    }
  );
});

describe("scoreForValidWords", () => {
  let board: Square[];
  let layTilesArgs: any;
  beforeEach(() => {
    board = generateBoard();
    layTilesArgs = { board, callback: layTiles };
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("FAR"),
    });
    finalizePlayOnBoard(board, board);
  });
  it.each`
    location | score | direction     | word
    ${15}    | ${17} | ${HORIZONTAL} | ${"ERE"}
    ${16}    | ${88} | ${HORIZONTAL} | ${" EQUIRE"}
  `(
    "Adds scores from all valid words in play",
    ({ location, score, direction, word }) => {
      const toPlay = tilesFromString(word);
      layTiles({
        ...layTilesArgs,
        direction,
        location,
        toPlay,
      });
      const laidTiles = board.slice(location, location + word.length);
      const playSquares = allSquaresInWord(laidTiles, board, direction);
      expect(scoreForValidWords(playSquares, board)).toBe(score);
    }
  );
});

describe("checkForInvalidWords", () => {
  let board: Square[];
  let layTilesArgs: any;
  const wordlist: WordList = {};
  beforeEach(() => {
    board = generateBoard();
    layTilesArgs = { board, callback: layTiles };
    layTiles({
      ...layTilesArgs,
      direction: HORIZONTAL,
      location: 0,
      toPlay: tilesFromString("FAR"),
    });
    finalizePlayOnBoard(board, board);
  });
  it.each`
    location | direction     | word     | valid            | invalid
    ${15}    | ${HORIZONTAL} | ${"ERE"} | ${[]}            | ${["AR", "ERE", "FE", "RE"]}
    ${15}    | ${HORIZONTAL} | ${"ERE"} | ${["ERE", "AR"]} | ${["FE", "RE"]}
  `(
    "Checks all words in the current play and returns invalid words",
    ({ location, direction, word, valid, invalid }) => {
      const toPlay = tilesFromString(word);
      layTiles({
        ...layTilesArgs,
        direction,
        location,
        toPlay,
      });
      valid.forEach((word: string) => {
        wordlist[word] = 1;
      });
      const laidTiles = board.slice(location, location + word.length);
      const playSquares = allSquaresInWord(laidTiles, board, direction);
      const illegal = checkForInvalidWords(playSquares, board, wordlist);
      expect(illegal.sort()).toEqual(invalid);
    }
  );
});
