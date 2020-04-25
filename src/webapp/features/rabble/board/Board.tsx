import React from "react";
import styles from "./Board.module.css";
import { generateBoard } from "../../../../game/board";

import Square from "./Square";

type BoardProps = {};

const boardConfig = generateBoard();

const Board = (props: BoardProps) => {
  return (
    <div className={styles.squareContainer}>
      {boardConfig.map((square) => (
        <Square square={square} />
      ))}
    </div>
  );
};

export default Board;
