import React, { useState, useEffect } from "react";
import styles from "./GameBoard.module.css";

type GameBoardProps = {
  G: {
    cells: Array<number>;
  };
  moves: {
    clickCell: any;
  };
  events: {
    endTurn: any;
  };
  ctx: {
    currentPlayer: string;
    gameover?: {
      winner?: number;
      draw?: boolean;
    };
  };
};

const doCell = (value: number, id: number, onClick: any) => (
  <td className={styles.cell} key={`cell-${id}`} onClick={() => onClick(id)}>
    {value ? value : "[ ]"}
  </td>
);

const GameBoard = (props: GameBoardProps) => {
  const [played, setPlayed] = useState(false);
  const {
    G: { cells },
    moves: { clickCell },
    events: { endTurn },
    ctx: { currentPlayer, gameover }
  } = props;

  const onClick = (id: number) => {
    clickCell(id);
    setPlayed(true);
    console.log(`click ${id}`);
  };

  useEffect(() => {
    if (played && !gameover) {
      endTurn();
      setPlayed(false);
    }
  }, [endTurn, played, gameover]);

  let message = JSON.stringify(gameover);

  return (
    <div>
      <h3>Now Playing: {currentPlayer}</h3>
      <table id="board">
        <tbody>
          <tr key={"row-0"}>
            {doCell(cells[0], 0, onClick)}
            {doCell(cells[1], 1, onClick)}
            {doCell(cells[2], 2, onClick)}
          </tr>
          <tr key={"row-1"}>
            {doCell(cells[3], 3, onClick)}
            {doCell(cells[4], 4, onClick)}
            {doCell(cells[5], 5, onClick)}
          </tr>
          <tr key={"row-2"}>
            {doCell(cells[6], 6, onClick)}
            {doCell(cells[7], 7, onClick)}
            {doCell(cells[8], 8, onClick)}
          </tr>
        </tbody>
      </table>
      {message}
    </div>
  );
};

export default GameBoard;
