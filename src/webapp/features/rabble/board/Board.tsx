import React from "react";
import styles from "./Board.module.css";
import { generateBoard } from "../../../../game/board";

import { useSelector, useDispatch } from "react-redux";

import { selectSquares, changeSquareSelection } from "../boardSlice";

import Square from "./Square";

type BoardProps = {};

const Board = (props: BoardProps) => {
  const dispatch = useDispatch();
  const boardConfig = useSelector(selectSquares);
  return (
    <div className={styles.gridContainer}>
      <div className={styles.squaresGrid}>
        {boardConfig.map((square) => (
          <Square
            square={square}
            clickSquare={() => dispatch(changeSquareSelection(square.location))}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
