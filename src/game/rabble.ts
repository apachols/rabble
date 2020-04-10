import { INVALID_MOVE } from "boardgame.io/core";
import {
  createTileBag,
  shuffleTiles,
  drawTiles,
  playIsValid,
  pullPlayTilesFromRack,
  exchangeTiles,
  tilesFromString
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
    return {
      tileBag: shuffleTiles(createTileBag()),
      turns: [],
      players: {
        "0": {
          tileRack: [],
          score: 0
        },
        "1": {
          tileRack: [],
          score: 0
        }
      }
    };
  },

  playerView: (G: Game, ctx: GameContext, playerID: number) => {
    const redactedGame = { ...G };
    delete redactedGame["tileBag"];
    redactedGame["players"] = {
      [String(playerID)]: redactedGame["players"][playerID]
    };
    return redactedGame;
  },

  moves: {
    playWord: {
      move: (G: Game, ctx: GameContext, word: string) => {
        const { currentPlayer } = ctx;
        const { tileRack } = G.players[currentPlayer];
        const { tileBag } = G;
        // Check for valid move
        if (!playIsValid(word, tileRack)) {
          return INVALID_MOVE;
        }
        if (!wordlist[word.toUpperCase()]) {
          return INVALID_MOVE;
        }
        const playTiles = pullPlayTilesFromRack(word, tileRack);
        const score = playTiles.reduce((s: number, t: Tile) => s + t.value, 0);
        // record the turn in the turn list - TODO update server scores
        const thisTurn = {
          tiles: playTiles,
          playerID: currentPlayer,
          score
        };
        G.turns.push(thisTurn);
        // draw back to a full hand
        drawTiles(tileRack, tileBag);
      },
      client: false
    },
    drawTiles: {
      move: (G: Game, ctx: GameContext) => {
        const { currentPlayer } = ctx;
        const { tileRack } = G.players[currentPlayer];
        const { tileBag } = G;
        console.log("le server");
        drawTiles(tileRack, tileBag);
      },
      client: false
    },
    exchangeTiles: {
      move: (G: Game, ctx: GameContext, exchange: string) => {
        const { currentPlayer } = ctx;
        const { tileRack } = G.players[currentPlayer];
        const { tileBag } = G;
        exchangeTiles(tileBag, tileRack, tilesFromString(exchange));
      },
      client: false
    }
  },

  endIf: (G: Game, ctx: GameContext) => {
    if (IsVictory(G)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G)) {
      return { draw: true };
    }
  }
});

export default Rabble;
