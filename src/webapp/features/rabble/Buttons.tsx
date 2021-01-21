import React, { useState, useEffect } from "react";
import styles from "./Buttons.module.css";
import { useSelector, useDispatch } from "react-redux";
import { updateRackTiles } from "./rackSlice";
import { shuffleTiles } from "../../../game/tileBag";
import {
  clearPlayTiles,
  changeSquareSelection,
  selectPlaySquares,
} from "./boardSlice";

import SwapTiles from "./components/SwapTiles";
import Modal from "./components/Modal";

import { ReactComponent as ShuffleIcon } from "./svg/shuffle-outline.svg";
import { ReactComponent as UndoIcon } from "./svg/arrow-undo-outline.svg";
import { ReactComponent as SwapIcon } from "./svg/swap-horizontal-outline.svg";
import { ReactComponent as FlagIcon } from "./svg/flag-outline.svg";
import { ReactComponent as PlayIcon } from "./svg/play-circle-outline.svg";

import Button from "../rabble/components/Button/Button";

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

  // handlers for gameplay buttons
  const handlePass = () => {
    const confirmed = window.confirm(
      "Are you sure you want to Pass your turn?"
    );
    if (confirmed) {
      endTurn();
    }
  };

  const handleSwap = () => {
    dispatch(clearPlayTiles());
    dispatch(changeSquareSelection(null));
    setShowSwapModal(true);
  };

  const handleShuffle = () => {
    shuffleTiles(tileRack);
    reorderRackTiles(tileRack);
    dispatch(clearPlayTiles());
    dispatch(changeSquareSelection(null));
  };

  const handleUndo = () => {
    dispatch(clearPlayTiles());
    dispatch(changeSquareSelection(null));
    dispatch(updateRackTiles(tileRack));
    cleanUp();
  };

  const handlePlay = () => {
    if (playSquares.length) {
      playWord(playSquares);
      dispatch(clearPlayTiles());
      dispatch(changeSquareSelection(null));
    }
  };

  return (
    <div className={styles.buttons}>
      {currentPlayerHasTurn && (
        <Button
          btnclass="pass"
          onClick={handlePass}
          content="PASS"
          children={<FlagIcon />}
        />
        // <button
        //   className={styles.pass}
        //   onClick={() => {
        //     const confirmed = window.confirm(
        //       "Are you sure you want to Pass your turn?"
        //     );
        //     if (confirmed) {
        //       endTurn();
        //     }
        //   }}
        // >
        //   <FlagIcon />
        //   PASS
        // </button>
      )}
      {currentPlayerHasTurn && (
        <Button
          btnclass=""
          onClick={handleSwap}
          content="SWAP"
          children={<SwapIcon />}
        />
        // <button
        //   onClick={() => {
        //     dispatch(clearPlayTiles());
        //     dispatch(changeSquareSelection(null));
        //     setShowSwapModal(true);
        //   }}
        // >
        //   <SwapIcon />
        //   SWAP
        // </button>
      )}

      <Button
        btnclass=""
        onClick={handleShuffle}
        content="SHUFFLE"
        children={<ShuffleIcon />}
      />
      {/* <button
        onClick={() => {
          shuffleTiles(tileRack);
          reorderRackTiles(tileRack);
          dispatch(clearPlayTiles());
          dispatch(changeSquareSelection(null));
        }}
      >
        <ShuffleIcon />
        SHUFFLE
      </button> */}
      <Button
        btnclass=""
        onClick={handleUndo}
        content="UNDO"
        children={<UndoIcon />}
      />
      {/* <button
        onClick={() => {
          dispatch(clearPlayTiles());
          dispatch(changeSquareSelection(null));
          dispatch(updateRackTiles(tileRack));
          cleanUp();
        }}
      >
        <UndoIcon />
        UNDO
      </button> */}
      {currentPlayerHasTurn && (
        <Button
          btnclass="play"
          onClick={handlePlay}
          content="PLAY"
          children={<PlayIcon />}
        />
        // <button
        //   className={styles.play}
        //   onClick={() => {
        //     if (playSquares.length) {
        //       playWord(playSquares);
        //       dispatch(clearPlayTiles());
        //       dispatch(changeSquareSelection(null));
        //     }
        //   }}
        // >
        //   <PlayIcon />
        //   PLAY
        // </button>
      )}

      <Modal showModal={showSwapModal}>
        <SwapTiles
          showModal={showSwapModal}
          setShowModal={setShowSwapModal}
          playerTiles={tileRack}
          swapSelectedTiles={(tiles) => {
            exchangeTiles(tiles);
          }}
        />
      </Modal>
    </div>
  );
};

export default Buttons;
