import { createTileBag, shuffleTileBag } from "./tileBag";

function IsVictory(cells: Array<number>) {
  return false;
}

function IsDraw(cells: Array<number>) {
  return false;
}

const Rabble = {
  name: "rabble",

  setup: () => ({
    cells: Array(9).fill(null),
    tileBag: shuffleTileBag(createTileBag()),
    tileRack: []
  }),

  playerView: (G: any, ctx: any, id: number) => {
    console.log("PLAYER VIEW", G);
    const redactedGame = { ...G };
    // delete redactedGame["tileBag"];
    return redactedGame;
  },

  moves: {
    clickCell: (G: any, ctx: any, id: number) => {
      G.cells[id] = ctx.currentPlayer;
    },
    secretNoClientMove: {
      client: false,
      move: (G: any, ctx: any, id: number) => {
        console.log("secret beep");
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
