import { INVALID_MOVE } from "boardgame.io/core";
import {
  createTileBag,
  shuffleTiles,
  drawTiles,
  checkForPlayTilesInRack,
  pullPlayTilesFromRack,
  exchangeTiles,
} from "./tileBag";
import { hasCenterSquare, generateBoard, isFirstPlay } from "./board";
import {
  allTilesFromSquares,
  playTilesFromSquares,
  finalizePlayOnBoard,
  adjacentToAWord,
  playDirection,
  copyPlaySquaresToBoard,
  removePlayFromBoard,
  allSquaresInWord,
} from "./play";
import { checkForInvalidWords, scoreForValidWords } from "./score";

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
        },
        tileRack,
      };
    };
    return {
      tileBag,
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
        const { tileBag, gameBoard } = G;

        logMetaData.pid = currentPlayer;

        try {
          copyPlaySquaresToBoard(playSquares, gameBoard);

          const direction = playDirection(playSquares, gameBoard);
          const allSquares = allSquaresInWord(
            playSquares,
            gameBoard,
            direction
          );
          const allSquaresAsString = allTilesFromSquares(allSquares)
            .map((t) => t.letter)
            .join("");

          console.log("playword", allSquaresAsString);

          const wordAsTiles = playTilesFromSquares(playSquares);
          if (!checkForPlayTilesInRack(wordAsTiles, tileRack)) {
            console.log(
              "playword - invalid - play / rack tile mismatch",
              allSquaresAsString
            );
            return INVALID_MOVE;
          }
          if (!currentPlay.valid) {
            console.log(
              "playword - invalid - currentPlay.valid",
              allSquaresAsString
            );
            return INVALID_MOVE;
          }
          pullPlayTilesFromRack(wordAsTiles, tileRack);

          const score = scoreForValidWords(playSquares, gameBoard);
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

          finalizePlayOnBoard(playSquares, gameBoard);

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

        // reset the "is the word you are trying to play valid" bit
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
        console.log("SETNICKNAME", nickname);
        G.players[currentPlayer].nickname = nickname;
        if (G.scoreList) {
          G.scoreList[currentPlayer].nickname = nickname;
        }
      },
      client: false,
    },
    cleanUp: {
      move: (G: Game, ctx: GameContext) => {
        const { currentPlayer } = ctx;
        const { currentPlay } = G.players[currentPlayer];
        currentPlay.tilesLaid = [];
        currentPlay.valid = false;
        currentPlay.invalidReason = "";
      },
      client: true,
    },
    checkWord: {
      move: (G: Game, ctx: GameContext, playSquares: Square[]) => {
        const { currentPlayer } = ctx;
        const { gameBoard, tileBag } = G;
        const { tileRack, currentPlay } = G.players[currentPlayer];

        logMetaData.pid = currentPlayer;

        const wordAsTiles = playTilesFromSquares(playSquares);
        const wordAsString = wordAsTiles.map((t) => t.letter).join("");

        console.log("CHECKWORD", wordAsString);
        console.log("TILES REMAINING", tileBag.length);

        try {
          if (isFirstPlay(gameBoard)) {
            if (!hasCenterSquare(playSquares)) {
              console.log("firstPlayNotCentered");
              currentPlay.invalidReason =
                "The first play must include the center square";
              currentPlay.tilesLaid = wordAsTiles;
              currentPlay.valid = false;
              return;
            }
          } else {
            if (!adjacentToAWord(playSquares, gameBoard)) {
              console.log("playNotAdjacent", wordAsString);
              currentPlay.invalidReason =
                "Your play must touch a tile on the board";
              currentPlay.tilesLaid = wordAsTiles;
              currentPlay.valid = false;
              return;
            }
          }
          if (playDirection(playSquares, gameBoard) === null) {
            console.log("playDirection", wordAsString);
            currentPlay.invalidReason =
              "Play must be in a single row or column";
            currentPlay.tilesLaid = wordAsTiles;
            currentPlay.valid = false;
          }
          if (!checkForPlayTilesInRack(wordAsTiles, tileRack)) {
            console.log("checkForPlayTilesInRack", wordAsString);
            currentPlay.invalidReason = "Mismatch between play and hand";
            currentPlay.tilesLaid = wordAsTiles;
            currentPlay.valid = false;
            return;
          }

          // To check for valid words and score the play, the playTiles must be on the board
          copyPlaySquaresToBoard(playSquares, gameBoard);
          const invalidWordList = checkForInvalidWords(
            playSquares,
            gameBoard,
            wordlist
          );
          removePlayFromBoard(gameBoard);
          if (invalidWordList.length) {
            const invalidWords = invalidWordList.join(", ");
            currentPlay.invalidReason = `These words are not in the dictionary: ${invalidWords}`;
            console.log("checkForInvalidWords", invalidWordList);
            currentPlay.tilesLaid = wordAsTiles;
            currentPlay.valid = false;
            return;
          }
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
    const { tileBag } = G;
    const emptyTileBag = tileBag.length === 0;
    const player0 = G.players["0"];
    const player1 = G.players["1"];
    const emptyRackPlayer0 = player0.tileRack.length === 0;
    const emptyRackPlayer1 = player1.tileRack.length === 0;
    const finalScores = { ...G.scores };

    // Here, pull scores from scorelist instead of obsoleted G.scores
    const finalScores2 = G.scoreList
      ? Object.keys(G.scoreList).reduce(
          (fscores: { [key: string]: number }, playerID: string) => {
            return { ...fscores, [playerID]: G.scoreList[playerID].score };
          },
          {}
        )
      : null;

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
        finalScores[playerID] += score;
      };
      if (emptyRackPlayer0) {
        applyFinalBonus("0", points);
        applyFinalBonus("1", -1 * points);
      } else {
        applyFinalBonus("1", points);
        applyFinalBonus("0", -1 * points);
      }

      // Victory!
      console.log(`Score Player0 ${finalScores["0"]}`);
      console.log(`Score Player1 ${finalScores["1"]}`);

      // TODO - Clean up scores and use only scorelist
      const scoreList = {
        "0": {
          nickname: G.scoreList?.["0"] || "",
          score: finalScores["0"],
        },
        "1": {
          nickname: G.scoreList?.["1"] || "",
          score: finalScores["1"],
        },
      };

      if (finalScores["0"] > finalScores["1"]) {
        return { winner: "0", finalScores, scoreList };
      }
      if (finalScores["1"] > finalScores["0"]) {
        return { winner: "1", finalScores, scoreList };
      }
      // Or not
      return { draw: true, finalScores, scoreList };
    }
  },
});

export default Rabble;
