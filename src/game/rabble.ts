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
      return G;
    },
    drawTiles: {
      client: false,
      move: (G: any, ctx: any, id: number) => {
        console.log(
          "drawTiles drawTiles drawTiles drawTiles drawTiles drawTiles"
        );
        const cellsCopy = [...G.cells];

        cellsCopy[0] = ctx.currentPlayer;

        return { ...G, cells: cellsCopy };
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
