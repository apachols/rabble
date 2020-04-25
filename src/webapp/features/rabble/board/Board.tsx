import React from "react";
import styles from "./Board.module.css";
import { generateBoard } from "../../../../game/board";

import Square from "./Square";

type BoardProps = {};

const boardConfig = generateBoard();

const Board = (props: BoardProps) => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.squaresGrid}>
        {boardConfig.map((square) => (
          <Square square={square} />
        ))}
      </div>
    </div>
  );
};

export default Board;
