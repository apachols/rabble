import { Client } from "boardgame.io/react";
import GameBoard from "./GameBoard";

function IsVictory(cells: Array<number>) {
  const rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];
  const columns = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ];
  const diagonals = [
    [0, 4, 8],
    [2, 4, 6]
  ];

  const winning = (triple: Array<number>): boolean => {
    return (
      cells[triple[0]] !== null &&
      cells[triple[0]] === cells[triple[1]] &&
      cells[triple[1]] === cells[triple[2]]
    );
  };

  return rows.some(winning) || columns.some(winning) || diagonals.some(winning);
}

function IsDraw(cells: Array<number>) {
  return cells.filter(c => c === null).length === 0;
}

const TicTacToe = {
  setup: () => ({ cells: Array(9).fill(null) }),

  moves: {
    clickCell: (G: any, ctx: any, id: number) => {
      G.cells[id] = ctx.currentPlayer;
    }
  },

  endIf: (G: any, ctx: any) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
    // console.log(JSON.stringify(G.cells));
  }
};

const Engine = Client({ game: TicTacToe, board: GameBoard });

export default Engine;
