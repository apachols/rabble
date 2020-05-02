import React from "react";
import styles from "./Board.module.css";

import { useSelector, useDispatch } from "react-redux";

import {
  selectSquares,
  changeSquareSelection,
  selectDirection,
  selectSelectedLocation,
} from "../boardSlice";

import Square from "./Square";

type BoardProps = {};

const Board = (props: BoardProps) => {
  const dispatch = useDispatch();
  const boardConfig = useSelector(selectSquares);
  const direction = useSelector(selectDirection);
  const selectedLocation = useSelector(selectSelectedLocation);
  return (
    <div className={styles.gridContainer}>
      <div className={styles.squaresGrid}>
        {boardConfig.map((square) => (
          <Square
            key={square.location}
            direction={direction}
            square={square}
            selectedLocation={selectedLocation}
            clickSquare={() => dispatch(changeSquareSelection(square.location))}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
