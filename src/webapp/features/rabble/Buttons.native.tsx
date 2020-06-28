import React, { useState, useEffect } from "react";
// import styles from "./Buttons.module.css";
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-native-elements";
// import Icon from 'react-native-vector-icons/FontAwesome';
import { updateRackTiles } from "./rackSlice";
import { shuffleTiles } from "../../../game/tileBag";
import {
  clearPlayTiles,
  changeSquareSelection,
  selectPlaySquares,
} from "./boardSlice";

import SwapTiles from "./components/SwapTiles";
import Modal from "./components/Modal";

type ButtonsProps = {
  currentPlayerHasTurn: boolean;
  tileRack: Tile[];
  playWord: (playSquares: Square[]) => void;
  checkWord: (playSquares: Square[]) => void;
  endTurn: () => {};
  cleanUp: () => void;
  exchangeTiles: (tiles: Tile[]) => void;
  currentPlay: CurrentPlayInfo;
  reorderRackTiles: (rackTiles: Tile[]) => void;
};

const Buttons = ({
  currentPlayerHasTurn,
  playWord,
  endTurn,
  cleanUp,
  exchangeTiles,
  tileRack,
  currentPlay,
  reorderRackTiles,
}: ButtonsProps) => {
  const dispatch = useDispatch();

  const [showSwapModal, setShowSwapModal] = useState(false);

  const playSquares = useSelector(selectPlaySquares);
  // end turn when played is true
  // TODO - timing issue, otherwise endTurn comes too soon after playWord
  // If we try to do this on the server, we get "ERROR: invalid stateID"
  useEffect(() => {
    if (currentPlay.played) {
      console.log("HOOK RUNNING", "endTurn");
      cleanUp();
      setTimeout(() => {
        endTurn();
      }, 500);
    }
  }, [currentPlay.played, endTurn, cleanUp]);

  return (
    <View style={styles.container}>
      {currentPlayerHasTurn && (
        <Button
          // containerStyle={styles.pass}
          icon={{
            name: "flag-o"
          }}
          title="PASS"
          onPress={() => {
            endTurn();
            // const confirmed = window.confirm(
            //   "Are you sure you want to Pass your turn?"
            // );
            // if (confirmed) {
            //   endTurn();
            // }
          }}
        />
      )}
      {currentPlayerHasTurn && (
        <Button
          icon={{
            name: "exchange"
          }}
          title="SWAP"
          onPress={() => {
            dispatch(clearPlayTiles());
            dispatch(changeSquareSelection(null));
            setShowSwapModal(true);
          }}
        />
      )}
      <Button
        icon={{
          name: "random"
        }}
        title="SHUFFLE"
        onPress={() => {
          shuffleTiles(tileRack);
          reorderRackTiles(tileRack);
          dispatch(clearPlayTiles());
          dispatch(changeSquareSelection(null));
        }}
      />
      <Button
        icon={{
          name: "undo"
        }}
        title="UNDO"
        onPress={() => {
          dispatch(clearPlayTiles());
          dispatch(changeSquareSelection(null));
          dispatch(updateRackTiles(tileRack));
          cleanUp();
        }}
      />
      {currentPlayerHasTurn && (
        <Button
          // style={styles.play}
          icon={{
            name: "play-circle-o"
          }}
          title="PLAY"
          onPress={() => {
            if (playSquares.length) {
              playWord(playSquares);
              dispatch(clearPlayTiles());
              dispatch(changeSquareSelection(null));
            }
          }}
        />
      )}

      {/* <Modal showModal={showSwapModal}>
        <SwapTiles
          showModal={showSwapModal}
          setShowModal={setShowSwapModal}
          playerTiles={tileRack}
          swapSelectedTiles={(tiles) => {
            exchangeTiles(tiles);
          }}
        />
      </Modal> */}
    </View>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  play: {
    color: 'green'
  },
  pass: {
    color: 'red'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
