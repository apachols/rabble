import { createTileBag, shuffleTileBag } from "./tileBag";

function IsVictory(cells: Array<number>) {
  return false;
}

function IsDraw(cells: Array<number>) {
  return false;
}

const Rabble = {
  name: "rabble",

  setup: () => {
    return {
      cells: Array(9).fill(null),
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
    clickCell: (G: any, ctx: any, id: number) => {
      G.cells[id] = ctx.currentPlayer;
    },
    drawTiles: {
      client: false,
      move: (G: any, ctx: any, id: number) => {
        console.log("DRAWING TILES");
        console.log(G.tileBag[0]);
        console.log("DRAWING TILES");
      }
    }
  },

  endIf: (G: any, ctx: any) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  }
};

export default Rabble;
