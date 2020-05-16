import React, { useState, useEffect } from "react";
import styles from "./ButtonsAndInput.module.css";
import { useSelector, useDispatch } from "react-redux";
import { updateRackTiles } from "./rackSlice";
import {
  updatePlayTiles,
  changeSquareSelection,
  selectPlaySquares,
  canPlayOneMoreTile,
} from "./boardSlice";
import {
  checkForPlayTilesInRack,
  pullPlayTilesFromRack,
  tilesFromString,
} from "../../../game/tileBag";
import Modal from "./components/Modal";
import ChooseBlank from "./components/ChooseBlank";

type ButtonsAndInputProps = {
  currentPlayIsValid: boolean;
  currentPlayerHasTurn: boolean;
  tileRack: Tile[];
  playTiles: Tile[];
  playWord: (playSquares: Square[]) => void;
  checkWord: (playSquares: Square[]) => void;
  exchangeTiles: (playTiles: Tile[]) => void;
  endTurn: () => {};
  cleanUp: () => void;
  currentPlayTilesLaid: Tile[];
  currentPlay: any;
  wordToPlayInputRef: React.RefObject<HTMLInputElement>;
};

const ButtonsAndInput = ({
  currentPlayIsValid,
  currentPlayerHasTurn,
  exchangeTiles,
  playWord,
  checkWord,
  endTurn,
  tileRack,
  playTiles,
  cleanUp,
  currentPlayTilesLaid,
  currentPlay,
  wordToPlayInputRef,
}: ButtonsAndInputProps) => {
  const dispatch = useDispatch();

  const [wordToPlay, setWordToPlay] = useState("");
  const [played, setPlayed] = useState(false);

  const playSquares = useSelector(selectPlaySquares);

  // If the current play is marked valid, run playWord
  useEffect(() => {
    if (currentPlayIsValid && playSquares.length > 0) {
      playWord(playSquares);
      dispatch(updatePlayTiles([]));
      dispatch(changeSquareSelection(null));
      setWordToPlay("");
      setPlayed(true);
    }
  }, [currentPlayIsValid, playSquares, dispatch, playWord]);

  // If the user has played but the word is invalid, clear tiles
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (!currentPlayIsValid && currentPlayTilesLaid?.length) {
      dispatch(updatePlayTiles([]));
      dispatch(changeSquareSelection(null));
      setWordToPlay("");
      setErrorMessage(currentPlay.invalidReason);
      cleanUp();
    }
  }, [
    currentPlayIsValid,
    currentPlayTilesLaid,
    currentPlay.invalidReason,
    cleanUp,
    dispatch,
  ]);

  // end turn when played is true
  // TODO - timing issue, otherwise endTurn comes too soon after playWord
  useEffect(() => {
    if (played) {
      setTimeout(() => {
        endTurn();
        setPlayed(false);
      }, 500);
    }
  }, [played, endTurn]);

  const playIsClear = useSelector(canPlayOneMoreTile);

  const handleInputChange = (word: string, rack: Tile[], play: Tile[]) => {
    const copyRack = [...rack];

    if (word.length > play.length && playIsClear) {
      try {
        const endOfWord = word.slice(play.length);
        if (endOfWord.includes(" ")) {
          setShowModal(true);
        }
        // Remove already laid tiles from rack
        pullPlayTilesFromRack(play, copyRack);
        // Remove newest tile from rack
        const newTiles = pullPlayTilesFromRack(
          tilesFromString(endOfWord),
          copyRack
        );

        // Put the tiles on the board
        dispatch(updatePlayTiles([...play, ...newTiles]));

        // The rack is now everything that hasn't been played
        dispatch(updateRackTiles(copyRack));

        // Since we've successfully moved tiles around, update the input
        setWordToPlay(word.toUpperCase());
        setErrorMessage("");
      } catch (err) {
        // TODO this should handle a specific error
        console.error(err);
      }
    } else {
      dispatch(updatePlayTiles([]));
      dispatch(updateRackTiles(copyRack));
      setWordToPlay("");
      setErrorMessage("");
    }
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div>
        <div className={styles.invalidPlayError}>{errorMessage}</div>
        <input
          className={styles.wordToPlayInput}
          name="wordToPlay"
          value={wordToPlay}
          onChange={(ev) => {
            handleInputChange(ev.target.value, tileRack, playTiles);
          }}
          ref={wordToPlayInputRef}
        />
      </div>
      <div>
        {currentPlayerHasTurn && (
          <button
            onClick={() => {
              checkWord(playSquares);
            }}
          >
            play tiles
          </button>
        )}
        {currentPlayerHasTurn && (
          <>
            <button
              onClick={() => {
                if (checkForPlayTilesInRack(playTiles, tileRack)) {
                  dispatch(updatePlayTiles([]));
                  exchangeTiles(playTiles);
                  setWordToPlay("");
                  setPlayed(true);
                }
              }}
            >
              exchange tiles
            </button>
            <button onClick={() => endTurn()}>pass</button>
          </>
        )}

        <Modal showModal={showModal}>
          <ChooseBlank
            selectTile={(selectedTile: Tile) => {
              setShowModal(false);
              const tiles = [...playTiles];
              setWordToPlay(
                tiles.map((t) => (t.blank ? " " : t.letter)).join("")
              );
              // TODO get this into a function
              const letters = tiles.map((t) => t.letter).join("");
              const pos = letters.indexOf(" ");
              if (pos > -1) {
                tiles[pos] = {
                  letter: selectedTile.letter,
                  value: 0,
                  blank: true,
                };
              } else {
                console.log("ChooseBlank did not find a blank...");
              }
              dispatch(updatePlayTiles(tiles));
              wordToPlayInputRef.current?.focus();
            }}
          />
        </Modal>
      </div>
    </>
  );
};

export default ButtonsAndInput;
