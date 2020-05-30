import React, { useEffect } from "react";
import styles from "./Board.module.css";

import { useSelector, useDispatch } from "react-redux";

import {
  updateBoard,
  changeSquareSelection,
  clearPlayTiles,
  selectSquares,
  selectDirection,
  selectPlaySquares,
  selectSelectedLocation,
  selectPlayableLocations,
} from "../boardSlice";

import { copyPlaySquaresToBoard } from "../../../../game/play";

import Square from "./Square";

type BoardProps = {
  gameBoard: Square[];
};

const Board = ({ gameBoard }: BoardProps) => {
  const dispatch = useDispatch();
  const boardConfig = useSelector(selectSquares);
  const direction = useSelector(selectDirection);
  const selectedLocation = useSelector(selectSelectedLocation);
  const playableLocations = useSelector(selectPlayableLocations);
  const playSquares = useSelector(selectPlaySquares);

  useEffect(() => {
    const copyBoard = gameBoard.map((s) => ({ ...s }));
    try {
      // If we have played squares and an update occurs because of checkword,
      // keep those squares on the board
      copyPlaySquaresToBoard(playSquares, copyBoard);
      dispatch(updateBoard(copyBoard));
    } catch (err) {
      // If a square is occupied on the board, clear the board...
      dispatch(updateBoard(gameBoard));
      dispatch(clearPlayTiles);
    }
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
            playableLocations={playableLocations}
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
