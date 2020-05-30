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
import { playTilesFromSquares } from "../../../game/play";

import { ReactComponent as ShuffleIcon } from "./svg/shuffle-outline.svg";
import { ReactComponent as UndoIcon } from "./svg/arrow-undo-outline.svg";
import { ReactComponent as SwapIcon } from "./svg/swap-horizontal-outline.svg";
import { ReactComponent as FlagIcon } from "./svg/flag-outline.svg";
import { ReactComponent as PlayIcon } from "./svg/play-circle-outline.svg";

type ButtonsProps = {
  currentPlayIsValid: boolean;
  currentPlayerHasTurn: boolean;
  tileRack: Tile[];
  playWord: (playSquares: Square[]) => void;
  checkWord: (playSquares: Square[]) => void;
  exchangeTiles: (playTiles: Tile[]) => void;
  endTurn: () => {};
  cleanUp: () => void;
  currentPlayTilesLaid: Tile[];
  currentPlay: any;
  setErrorMessage: (message: string) => void;
  reorderRackTiles: (rackTiles: Tile[]) => void;
};

const Buttons = ({
  currentPlayIsValid,
  currentPlayerHasTurn,
  exchangeTiles,
  playWord,
  checkWord,
  endTurn,
  cleanUp,
  tileRack,
  currentPlayTilesLaid,
  currentPlay,
  setErrorMessage,
  reorderRackTiles,
}: ButtonsProps) => {
  const dispatch = useDispatch();

  const [played, setPlayed] = useState(false);

  const playSquares = useSelector(selectPlaySquares);

  // If the current play is marked valid, run playWord
  useEffect(() => {
    if (currentPlayIsValid && playSquares.length > 0) {
      playWord(playSquares);
      dispatch(clearPlayTiles());
      dispatch(changeSquareSelection(null));
      setPlayed(true);
      cleanUp();
    }
  }, [currentPlayIsValid, playSquares, dispatch, playWord, cleanUp]);

  // If the user has played but the word is invalid, clear tiles
  useEffect(() => {
    if (!currentPlayIsValid && currentPlayTilesLaid?.length) {
      dispatch(clearPlayTiles());
      dispatch(changeSquareSelection(null));
      setErrorMessage(currentPlay.invalidReason);
      cleanUp();
    }
  }, [
    currentPlayIsValid,
    currentPlayTilesLaid,
    currentPlay.invalidReason,
    cleanUp,
    dispatch,
    setErrorMessage,
  ]);

  // end turn when played is true
  // TODO - timing issue, otherwise endTurn comes too soon after playWord
  // If we try to do this on the server, we get "ERROR: invalid stateID"
  useEffect(() => {
    if (played) {
      setTimeout(() => {
        endTurn();
        setPlayed(false);
      }, 500);
    }
  }, [played, endTurn]);

  return (
    <div className={styles.buttons}>
      {currentPlayerHasTurn && (
        <button onClick={() => endTurn()}>
          <FlagIcon />
          PASS
        </button>
      )}
      <button
        onClick={() => {
          dispatch(clearPlayTiles());
          dispatch(changeSquareSelection(null));
          dispatch(updateRackTiles(tileRack));
        }}
      >
        <UndoIcon />
        UNDO
      </button>
      {currentPlayerHasTurn && (
        <button
          className={styles.play}
          onClick={() => {
            checkWord(playSquares);
          }}
        >
          <PlayIcon />
          PLAY
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

      {currentPlayerHasTurn && (
        <button
          onClick={() => {
            if (playSquares.length > 0) {
              dispatch(clearPlayTiles());
              exchangeTiles(playTilesFromSquares(playSquares));
              dispatch(changeSquareSelection(null));
              setPlayed(true);
              cleanUp();
            }
          }}
        >
          <SwapIcon />
          SWAP
        </button>
      )}
    </div>
  );
};

export default Buttons;
