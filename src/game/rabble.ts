import { INVALID_MOVE } from "boardgame.io/core";
import {
  createTileBag,
  shuffleTiles,
  drawTiles,
  checkForPlayTilesInRack,
  pullPlayTilesFromRack,
  exchangeTiles,
} from "./tileBag";
import {
  hasCenterSquare,
  generateBoard,
  isFirstPlay,
  // consolePrintBoard,
} from "./board";
import {
  allTilesFromSquares,
  playTilesFromSquares,
  finalizePlayOnBoard,
  adjacentToAWord,
  playDirection,
  copyPlaySquaresToBoard,
  allSquaresInWord,
} from "./play";
import { checkForInvalidWords, scoreForValidWords } from "./score";

const playIsInvalid = (
  playSquares: Square[],
  board: Square[],
  wordlist: WordList,
  tileRack: Tile[],
  wordAsTiles: Tile[]
) => {
  const currentPlay: CurrentPlayInfo = {
    invalidReason: "",
    valid: false,
    tilesLaid: [],
    played: false,
  };
  if (isFirstPlay(board)) {
    if (!hasCenterSquare(playSquares)) {
      currentPlay.invalidReason =
        "The first play must include the center square";
      currentPlay.valid = false;
      return currentPlay;
    }
  } else {
    if (!adjacentToAWord(playSquares, board)) {
      currentPlay.invalidReason = "Your play must touch a tile on the board";
      currentPlay.valid = false;
      return currentPlay;
    }
  }
  if (playDirection(playSquares, board) === null) {
    currentPlay.invalidReason = "Play must be in a single row or column";
    currentPlay.valid = false;
    return currentPlay;
  }
  if (!checkForPlayTilesInRack(wordAsTiles, tileRack)) {
    currentPlay.invalidReason = "Mismatch between play and hand";
    currentPlay.valid = false;
    return currentPlay;
  }
  const invalidWordList = checkForInvalidWords(playSquares, board, wordlist);
  if (invalidWordList.length) {
    const invalidWords = invalidWordList.join(", ");
    currentPlay.invalidReason = `These words are not in the dictionary: ${invalidWords}`;
    currentPlay.valid = false;
    return currentPlay;
  }
  return null;
};

const prefixed = (logPrefixFunction: any, original: any) =>
  function () {
    const payload = logPrefixFunction();
    if (payload) {
      original(payload, ...arguments);
    } else {
      original(...arguments);
    }
  };

const logMetaData: any = {};

if (process?.env) {
  const logMetaDataIfAny = () => logMetaData;
  console.log = prefixed(logMetaDataIfAny, console.log);
  console.info = prefixed(logMetaDataIfAny, console.info);
  console.error = prefixed(logMetaDataIfAny, console.error);
}

const Rabble = (wordlist: WordList) => ({
  name: "rabble",

  setup: (): Game => {
    const gameBoard = generateBoard();
    const tileBag = shuffleTiles(createTileBag());
    const makePlayer = () => {
      const tileRack: Tile[] = [];
      drawTiles(tileRack, tileBag);
      return {
        nickname: "Player",
        currentPlay: {
          invalidReason: "",
          tilesLaid: [],
          valid: false,
          played: false,
        },
        tileRack,
      };
    };
    return {
      tileBag,
      remainingTileCount: 100,
      gameBoard,
      turns: [],
      scoreList: {
        "0": {
          nickname: "",
          score: 0,
        },
        "1": {
          nickname: "",
          score: 0,
        },
      },
      // TODO remove old scores that's missing nickname
      scores: {
        "0": 0,
        "1": 0,
      },
      players: {
        "0": makePlayer(),
        "1": makePlayer(),
      },
    };
  },

  playerView: (G: Game, ctx: GameContext, playerID: number) => {
    const redactedGame = { ...G };
    delete redactedGame["tileBag"];
    redactedGame["players"] = {
      [String(playerID)]: redactedGame["players"][playerID],
    };
    return redactedGame;
  },

  moves: {
    playWord: {
      move: (G: Game, ctx: GameContext, playSquares: Square[]) => {
        const { currentPlayer } = ctx;
        const { tileRack, currentPlay, nickname } = G.players[currentPlayer];
        const { tileBag } = G;

        logMetaData.pid = currentPlayer;

        try {
          const boardCopy = G.gameBoard.map((square) => ({ ...square }));
          copyPlaySquaresToBoard(playSquares, boardCopy);
          const direction = playDirection(playSquares, boardCopy);
          const allSquares = allSquaresInWord(
            playSquares,
            boardCopy,
            direction
          );
          const allSquaresAsString = allTilesFromSquares(allSquares)
            .map((t) => t.letter)
            .join("");

          console.log("PLAY WORD", allSquaresAsString);

          const wordAsTiles = playTilesFromSquares(playSquares);
          try {
            const result = playIsInvalid(
              playSquares,
              boardCopy,
              wordlist,
              tileRack,
              wordAsTiles
            );
            if (result) {
              currentPlay.invalidReason = result.invalidReason;
              currentPlay.valid = result.valid;
              console.log("PLAYWORD_INVALID_PLAY", currentPlay.invalidReason);
              return;
            }
            currentPlay.valid = true;
          } catch (err) {
            console.error(`Error in playWord ${err} \n${err.stack}`);
            return INVALID_MOVE;
          }

          // If we got here, play is valid
          copyPlaySquaresToBoard(playSquares, G.gameBoard);

          pullPlayTilesFromRack(wordAsTiles, tileRack);

          const score = scoreForValidWords(playSquares, G.gameBoard);
          // TODO - remove old scores list that's missing nickname
          G.scores[currentPlayer] += score;
          if (!G.scoreList) {
            G.scoreList = {
              "0": {
                nickname: "",
                score: 0,
              },
              "1": {
                nickname: "",
                score: 0,
              },
            };
          }
          G.scoreList[currentPlayer].score += score;
          G.scoreList[currentPlayer].nickname = nickname;

          finalizePlayOnBoard(playSquares, G.gameBoard);

          // record the turn in the turn list
          const thisTurn = {
            turnID: `${ctx.turn}-${currentPlayer}`,
            tiles: allTilesFromSquares(allSquares),
            playerID: currentPlayer,
            nickname,
            score,
          };
          G.turns.push(thisTurn);
        } catch (err) {
          console.error(`Error in playWord ${err} \n${err.stack}`);
          return INVALID_MOVE;
        }

        // draw back to a full hand
        drawTiles(tileRack, tileBag);

        console.log("TILES REMAINING", tileBag.length);
        G.remainingTileCount = tileBag.length;

        // reset the "is the word you are trying to play valid" bit
        currentPlay.played = true;
        currentPlay.valid = false;
        currentPlay.tilesLaid = [];
        currentPlay.invalidReason = "";
      },
      client: false,
    },
    drawTiles: {
      move: (G: Game, ctx: GameContext) => {
        const { currentPlayer } = ctx;
        const { tileRack } = G.players[currentPlayer];
        const { tileBag } = G;

        logMetaData.pid = currentPlayer;

        drawTiles(tileRack, tileBag);
      },
      client: false,
    },
    exchangeTiles: {
      move: (G: Game, ctx: GameContext, exchange: Tile[]) => {
        const { currentPlayer } = ctx;
        const { currentPlay, tileRack, nickname } = G.players[currentPlayer];
        const { tileBag } = G;

        if (tileBag.length < 7) {
          currentPlay.invalidReason = "Not enough tiles in bag for exchange";
          return INVALID_MOVE;
        }

        logMetaData.pid = currentPlayer;
        try {
          exchangeTiles(tileBag, tileRack, exchange);
        } catch (err) {
          console.error(`Error in exchangeTiles ${err} \n${err.stack}`);
          return INVALID_MOVE;
        }

        const thisTurn = {
          turnID: `${ctx.turn}-${currentPlayer}`,
          playerID: currentPlayer,
          tiles: [],
          nickname,
          score: 0,
        };
        G.turns.push(thisTurn);
      },
      client: false,
    },
    setNickName: {
      move: (G: Game, ctx: GameContext, nickname: string) => {
        const { currentPlayer } = ctx;
        G.players[currentPlayer].nickname = nickname;
        if (G.scoreList) {
          G.scoreList[currentPlayer].nickname = nickname;
        }
      },
      client: true,
    },
    reorderRackTiles: {
      move: (G: Game, ctx: GameContext, rackTiles: Tile[]) => {
        const { currentPlayer } = ctx;
        G.players[currentPlayer].tileRack = [...rackTiles];
      },
      client: true,
    },
    cleanUp: {
      move: (G: Game, ctx: GameContext) => {
        const { currentPlayer } = ctx;
        const { currentPlay } = G.players[currentPlayer];
        currentPlay.played = false;
        currentPlay.tilesLaid = [];
        currentPlay.valid = false;
        currentPlay.invalidReason = "";
      },
      client: true,
    },
    checkWord: {
      move: (G: Game, ctx: GameContext, playSquares: Square[]) => {
        const { currentPlayer } = ctx;
        const { tileRack, currentPlay } = G.players[currentPlayer];

        logMetaData.pid = currentPlayer;

        const wordAsTiles = playTilesFromSquares(playSquares);
        const wordAsString = wordAsTiles.map((t) => t.letter).join("");
        console.log("CHECKWORD", wordAsString);

        const boardCopy = G.gameBoard.map((square) => ({ ...square }));
        copyPlaySquaresToBoard(playSquares, boardCopy);
        try {
          const result = playIsInvalid(
            playSquares,
            boardCopy,
            wordlist,
            tileRack,
            wordAsTiles
          );
          if (result) {
            currentPlay.invalidReason = result.invalidReason;
            currentPlay.valid = result.valid;
            console.log("CHECKWORD_INVALID_PLAY", currentPlay.invalidReason);
            return;
          }
          currentPlay.invalidReason = "";
          currentPlay.valid = true;
        } catch (err) {
          console.error(`Error in checkWord ${err} \n${err.stack}`);
          return INVALID_MOVE;
        }
      },
      client: false,
    },
  },

  // TODO more than two players obviously
  endIf: (G: Game, ctx: GameContext) => {
    const { tileBag, turns } = G;
    const emptyTileBag = tileBag.length === 0;
    const player0 = G.players["0"];
    const player1 = G.players["1"];
    const emptyRackPlayer0 = player0.tileRack.length === 0;
    const emptyRackPlayer1 = player1.tileRack.length === 0;

    // Create copies here since we cannot mutate in this hook >:|
    const finalTurns = [...turns];
    const finalScoreList: ScoreList = Object.keys(G.scoreList).reduce(
      (fscorelist, pid) => ({ ...fscorelist, [pid]: { ...G.scoreList[pid] } }),
      {}
    );

    if (emptyTileBag && (emptyRackPlayer0 || emptyRackPlayer1)) {
      // Play-out bonus
      const rackToCalculate = emptyRackPlayer0
        ? player1.tileRack
        : player0.tileRack;

      console.log(`FINAL rack ${rackToCalculate.map((t) => t.letter)}`);
      const points = rackToCalculate.reduce(
        (score, tile) => score + tile.value,
        0
      );
      console.log(`FINAL points ${points}`);

      const applyFinalBonus = (playerID: string, score: number) => {
        finalScoreList[playerID].score += score;
        const thisTurn = {
          turnID: `${ctx.turn}-${playerID}`,
          tiles: [...rackToCalculate],
          playerID,
          nickname: finalScoreList[playerID].nickname,
          score,
        };
        finalTurns.push(thisTurn);
      };

      if (emptyRackPlayer0) {
        applyFinalBonus("0", points);
        applyFinalBonus("1", -1 * points);
      } else {
        applyFinalBonus("1", points);
        applyFinalBonus("0", -1 * points);
      }

      // Victory!
      console.log(`Score Player0 ${finalScoreList["0"].score}`);
      console.log(`Score Player1 ${finalScoreList["1"].score}`);

      if (finalScoreList["0"].score > finalScoreList["1"].score) {
        return {
          winner: finalScoreList["0"].nickname,
          scoreList: finalScoreList,
          finalTurns,
        };
      }
      if (finalScoreList["1"].score > finalScoreList["0"].score) {
        return {
          winner: finalScoreList["1"].nickname,
          scoreList: finalScoreList,
          finalTurns,
        };
      }
      // Or not
      return { draw: true, scoreList: finalScoreList, finalTurns };
    }
  },
});

export default Rabble;
