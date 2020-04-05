import { createTileBag, shuffleTiles, drawTiles } from "./tileBag";

function IsVictory(G: any) {
  return false;
}

function IsDraw(G: any) {
  return false;
}

const Rabble = {
  name: "rabble",

  setup: () => {
    return {
      tileBag: shuffleTiles(createTileBag()),
      players: {
        "0": {
          tileRack: []
        },
        "1": {
          tileRack: []
        }
      }
    };
  },

  playerView: (G: any, ctx: any, playerID: number) => {
    const redactedGame = { ...G };
    delete redactedGame["tileBag"];
    redactedGame["players"] = {
      [String(playerID)]: redactedGame["players"][playerID]
    };
    return redactedGame;
  },

  moves: {
    drawTiles: {
      move: (G: any, ctx: any) => {
        const { currentPlayer } = ctx;
        const { tileRack } = G.players[currentPlayer];
        const { tileBag } = G;
        drawTiles(tileRack, tileBag);
      },
      client: false
    }
  },

  endIf: (G: any, ctx: any) => {
    if (IsVictory(G)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G)) {
      return { draw: true };
    }
  }
};

export default Rabble;
