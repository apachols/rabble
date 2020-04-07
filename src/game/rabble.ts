import { INVALID_MOVE } from "boardgame.io/core";
import {
  createTileBag,
  shuffleTiles,
  drawTiles,
  playIsValid,
  pullPlayTilesFromRack
} from "./tileBag";

function IsVictory(G: Game) {
  return false;
}

function IsDraw(G: Game) {
  return false;
}

const Rabble = {
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
        if (!playIsValid(word, tileRack)) {
          return INVALID_MOVE;
        }
        const playTiles = pullPlayTilesFromRack(word, tileRack);
        const score = playTiles.reduce(
          (sum: number, tile: Tile) => sum + tile.value,
          0
        );
        const thisTurn = {
          tiles: playTiles,
          playerID: currentPlayer,
          score
        };
        G.turns.push(thisTurn);
        drawTiles(tileRack, tileBag);
      },
      client: false
    },
    drawTiles: {
      move: (G: Game, ctx: GameContext) => {
        const { currentPlayer } = ctx;
        const { tileRack } = G.players[currentPlayer];
        const { tileBag } = G;
        drawTiles(tileRack, tileBag);
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
};

export default Rabble;
