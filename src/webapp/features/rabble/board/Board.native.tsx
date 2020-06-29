import React, { useEffect } from "react";
// import styles from "./Board.module.css";
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useSelector, useDispatch } from "react-redux";

import {
  updateBoard,
  changeSquareSelection,
  selectSquares,
  selectDirection,
  selectSelectedLocation,
  selectPlayableLocations,
} from "../boardSlice";

import Square from "./Square.native";

type BoardProps = {
  gameBoard: Square[];
};

const Board = ({ gameBoard }: BoardProps) => {
  const dispatch = useDispatch();
  const boardConfig = useSelector(selectSquares);
  const direction = useSelector(selectDirection);
  const selectedLocation = useSelector(selectSelectedLocation);
  const playableLocations = useSelector(selectPlayableLocations);

  useEffect(() => {
    dispatch(updateBoard(gameBoard));
  }, [dispatch, gameBoard]);

  return (
    <View style={styles.gridContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default Board;
