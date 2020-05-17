import React, { useEffect } from "react";
import styles from "./Board.module.css";

import { useSelector, useDispatch } from "react-redux";

import {
  updateBoard,
  changeSquareSelection,
  selectSquares,
  selectDirection,
  selectSelectedLocation,
} from "../boardSlice";

import Square from "./Square";

type BoardProps = {
  gameBoard: Square[];
};

const Board = ({ gameBoard }: BoardProps) => {
  const dispatch = useDispatch();
  const boardConfig = useSelector(selectSquares);
  const direction = useSelector(selectDirection);
  const selectedLocation = useSelector(selectSelectedLocation);

  useEffect(() => {
    dispatch(updateBoard(gameBoard));
  }, [dispatch, gameBoard]);

  return (
    <div className={styles.gridContainer}>
      <div className={styles.squaresGrid}>
        {boardConfig.map((square) => (
          <Square
            key={square.location}
            direction={direction}
            square={square}
            selectedLocation={selectedLocation}
            clickSquare={() => {
              dispatch(changeSquareSelection(square.location));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
