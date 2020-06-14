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
    <div className={styles.buttons}>
      {currentPlayerHasTurn && (
        <button
          className={styles.pass}
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to Pass your turn?"
            );
            if (confirmed) {
              endTurn();
            }
          }}
        >
          <FlagIcon />
          PASS
        </button>
      )}
      {currentPlayerHasTurn && (
        <button
          onClick={() => {
            dispatch(clearPlayTiles());
            dispatch(changeSquareSelection(null));
            setShowSwapModal(true);
          }}
        >
          <SwapIcon />
          SWAP
        </button>
      )}
      <button
        onClick={() => {
          shuffleTiles(tileRack);
          reorderRackTiles(tileRack);
          dispatch(clearPlayTiles());
          dispatch(changeSquareSelection(null));
        }}
      >
        <ShuffleIcon />
        SHUFFLE
      </button>
      <button
        onClick={() => {
          dispatch(clearPlayTiles());
          dispatch(changeSquareSelection(null));
          dispatch(updateRackTiles(tileRack));
          cleanUp();
        }}
      >
        <UndoIcon />
        UNDO
      </button>
      {currentPlayerHasTurn && (
        <button
          className={styles.play}
          onClick={() => {
            if (playSquares.length) {
              playWord(playSquares);
              dispatch(clearPlayTiles());
              dispatch(changeSquareSelection(null));
            }
          }}
        >
          <PlayIcon />
          PLAY
        </button>
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
