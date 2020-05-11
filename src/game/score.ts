import { stringFromTiles } from "./tileBag";

import {
  HORIZONTAL,
  VERTICAL,
  getNextLocation,
  getPreviousLocation,
  letterMultiplierForBonus,
  wordMultiplierForBonus,
} from "./board";

import {
  playDirection,
  allSquaresInWord,
  squaresAreAValidWord,
  allTilesFromSquares,
} from "./play";

export const allWordsForPlay = (
  playSquares: Square[],
  gameBoard: Square[]
): Array<Array<Square>> => {
  // Find the direction that the play is headed in
  const direction = playDirection(playSquares);
  if (direction === null) {
    // We should already have checked for out-of-line plays
    throw new Error(
      "Logic error - checkForInvalidWords found out of line play"
    );
  }

  const directional: Square[] = allSquaresInWord(
    playSquares,
    gameBoard,
    direction
  );
  if (directional.length === 0) {
    throw new Error(
      "Logic Error - directional play should not have zero length"
    );
  }

  const allWords = [directional];

  const oppositeDirection = direction === VERTICAL ? HORIZONTAL : VERTICAL;
  const orthogonal: Square[] = playSquares.filter((s) => {
    // Find each tile that touches another tile orthogonally
    const prev = getPreviousLocation(s.location, oppositeDirection);
    if (prev !== null && gameBoard[prev].tile) {
      return true;
    }
    const next = getNextLocation(s.location, oppositeDirection);
    if (next !== null && gameBoard[next].tile) {
      return true;
    }
    return false;
  });

  // For each of our play tiles that makes a new orthogonal word, include that word
  orthogonal.forEach((square) => {
    allWords.push(allSquaresInWord([square], gameBoard, oppositeDirection));
  });

  return allWords;
};

export const scoreForSquare = ({ tile, playTile, bonus, location }: Square) => {
  if (tile) {
    return tile.value;
  }
  if (playTile) {
    return playTile.value * letterMultiplierForBonus(bonus);
  }
  throw new Error(
    `Logic Error - should not be missing tile in score function, location ${location}`
  );
};

export const wordBonusesForWord = (word: Square[]): number[] => {
  const wordBonuses: number[] = [];
  word.forEach(({ bonus, playTile }) => {
    const multiplier = wordMultiplierForBonus(bonus);
    if (playTile && multiplier > 1) {
      wordBonuses.push(multiplier);
    }
  });
  return wordBonuses;
};

export const scoreForWord = (word: Square[]) => {
  let wordScore = 0;
  word.forEach((square) => {
    wordScore += scoreForSquare(square);
  });
  wordBonusesForWord(word).forEach((bonus) => {
    wordScore *= bonus;
  });
  if (word.filter((square) => square.playTile).length === 7) {
    wordScore += 50;
  }
  return wordScore;
};

export const scoreForValidWords = (
  playSquares: Square[],
  gameBoard: Square[]
): number =>
  allWordsForPlay(playSquares, gameBoard).reduce(
    (score, word) => score + scoreForWord(word),
    0
  );

export const checkForInvalidWords = (
  playSquares: Square[],
  gameBoard: Square[],
  wordlist: WordList
): string[] =>
  allWordsForPlay(playSquares, gameBoard).reduce(
    (invalid: string[], word: Square[]) => {
      if (!squaresAreAValidWord(word, wordlist)) {
        return [...invalid, stringFromTiles(allTilesFromSquares(word))];
      }
      return invalid;
    },
    []
  );
