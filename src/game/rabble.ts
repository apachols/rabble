import { INVALID_MOVE } from "boardgame.io/core";
import {
  createTileBag,
  shuffleTiles,
  drawTiles,
  playIsValid,
  pullPlayTilesFromRack,
  exchangeTiles,
} from "./tileBag";

function IsVictory(G: Game) {
  return false;
}

function IsDraw(G: Game) {
  return false;
}

const Rabble = (wordlist: WordList) => ({
  name: "rabble",

  setup: (): Game => {
    const tileBag = shuffleTiles(createTileBag());
    const makePlayer = () => {
      const tileRack: Tile[] = [];
      drawTiles(tileRack, tileBag);
      return {
        currentPlay: {
          invalidReason: "",
          tilesLaid: [],
          valid: false,
        },
        tileRack,
        score: 0,
      };
    };
    return {
      tileBag,
      turns: [],
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
      move: (G: Game, ctx: GameContext, word: Tile[]) => {
        const { currentPlayer } = ctx;
        const { tileRack, currentPlay } = G.players[currentPlayer];
        const { tileBag } = G;

        console.log("playword", word);

        const wordAsString = word.map((t) => t.letter).join("");

        // (Re)Check for valid move
        if (!playIsValid(word, tileRack)) {
          console.log("playword invalid, playIsValid", wordAsString);
          return INVALID_MOVE;
        }
        if (!wordlist[wordAsString.toUpperCase()]) {
          console.log("playword invalid, wordlist", wordAsString);
          return INVALID_MOVE;
        }
        if (!currentPlay.valid) {
          console.log("playword invalid, currentPlay.valid", wordAsString);
          return INVALID_MOVE;
        }

        const playTiles = pullPlayTilesFromRack(word, tileRack);

        // TODO score needs to look at the board, obviously
        const score = playTiles.reduce((s: number, t: Tile) => s + t.value, 0);

        // record the turn in the turn list - TODO update server scores
        const thisTurn = {
          turnID: `${ctx.turn}-${currentPlayer}`,
          tiles: word,
          playerID: currentPlayer,
          score,
        };
        G.turns.push(thisTurn);

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
        drawTiles(tileRack, tileBag);
      },
      client: false,
    },
    exchangeTiles: {
      move: (G: Game, ctx: GameContext, exchange: Tile[]) => {
        const { currentPlayer } = ctx;
        const { tileRack } = G.players[currentPlayer];
        const { tileBag } = G;
        exchangeTiles(tileBag, tileRack, exchange);
        const thisTurn = {
          turnID: `${ctx.turn}-${currentPlayer}`,
          tiles: exchange,
          playerID: currentPlayer,
          score: 0,
        };
        G.turns.push(thisTurn);
      },
      client: false,
    },
    cleanUp: {
      move: (G: Game, ctx: GameContext) => {
        const { currentPlayer } = ctx;
        const { currentPlay } = G.players[currentPlayer];
        currentPlay.tilesLaid = [];
        currentPlay.invalidReason = "";
      },
      client: true,
    },
    checkWord: {
      move: (G: Game, ctx: GameContext, word: Tile[]) => {
        const { currentPlayer } = ctx;
        const { tileRack, currentPlay } = G.players[currentPlayer];

        const wordAsString = word.map((t) => t.letter).join("");

        console.log("CHECKWORD", wordAsString);

        if (!playIsValid(word, tileRack)) {
          console.log("playIsValid", wordAsString);
          currentPlay.invalidReason = "Mismatch between play and hand";
          currentPlay.tilesLaid = word;
          currentPlay.valid = false;
          return;
        }
        if (!wordlist[wordAsString.toUpperCase()]) {
          currentPlay.invalidReason = `${wordAsString.toUpperCase()} is not in the dictionary`;
          console.log("wordList", wordAsString);
          currentPlay.tilesLaid = word;
          currentPlay.valid = false;
          return;
        }
        currentPlay.valid = true;
      },
      client: false,
    },
  },

  endIf: (G: Game, ctx: GameContext) => {
    if (IsVictory(G)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G)) {
      return { draw: true };
    }
  },
});

export default Rabble;
