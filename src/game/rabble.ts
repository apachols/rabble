import { createTileBag, shuffleTileBag } from "./tileBag";

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
      tileBag: shuffleTileBag(createTileBag()),
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
      client: false,
      move: (G: any, ctx: any, howManyTiles: number) => {
        const { currentPlayer } = ctx;
        for (let ii = 0; ii < howManyTiles; ii++) {
          const tile = G.tileBag.pop();
          if (tile) {
            G.players[currentPlayer].tileRack.push(tile);
          }
        }
      }
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
