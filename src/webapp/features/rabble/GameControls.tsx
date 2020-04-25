import React, { useState, useEffect, useRef } from "react";
import styles from "./GameControls.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, shuffleRack, updateRackTiles } from "./rackSlice";
import { selectPlayTiles, updatePlayTiles } from "./playSlice";
import {
  playIsValid,
  pullPlayTilesFromRack,
  tilesFromString,
} from "../../../game/tileBag";

import TileRack from "./components/TileRack";
import Modal from "./components/Modal";
import ChooseBlank from "./components/ChooseBlank";

import Board from "./board/Board";

type GameControlsProps = {
  G: Game;
  nowPlaying: string;
  playerID: string;
  moves: {
    drawTiles: () => void;
    exchangeTiles: (tiles: Tile[]) => void;
    playWord: (word: Tile[]) => void;
    checkWord: (word: Tile[]) => void;
    cleanUp: () => void;
  };
  events: {
    endTurn: any;
  };
};

const GameBoard = (props: GameControlsProps) => {
  const {
    playerID,
    nowPlaying,
    G: { players },
    moves: { playWord, exchangeTiles, checkWord, cleanUp },
    events: { endTurn },
  } = props;

  // Pull info for the current player
  const { tileRack, currentPlay } = players[playerID];
  const currentPlayerHasTurn = nowPlaying === playerID;
  const currentPlayIsValid = currentPlay.valid;
  const currentPlayTilesLaid = currentPlay.tilesLaid;

  // State for text input for wordToPlay
  const [wordToPlay, setWordToPlay] = useState("");

  // Update the rack tiles in the local reducer with the rack tiles from the server
  const dispatch = useDispatch();
  const displayTileRack = useSelector(selectTileRack);
  useEffect(() => {
    dispatch(updateRackTiles(tileRack));
  }, [dispatch, tileRack]);

  // These are tiles with which the player is trying to make a word
  const playTiles = useSelector(selectPlayTiles);

  // If the current play is marked valid, run playWord
  useEffect(() => {
    if (currentPlayIsValid && playTiles.length > 0) {
      playWord(playTiles);
      dispatch(updatePlayTiles([]));
      setWordToPlay("");
      setPlayed(true);
    }
  }, [currentPlayIsValid, playTiles, dispatch, playWord]);

  // If the user has played but the word is invalid, clear tiles
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (!currentPlayIsValid && currentPlayTilesLaid?.length) {
      dispatch(updatePlayTiles([]));
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

  // TODO - endTurn comes too soon after playWord.
  // How can we fix the timing issue?
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    if (played) {
      setTimeout(() => {
        endTurn();
        setPlayed(false);
      }, 500);
    }
  }, [played, endTurn]);

  const [showModal, setShowModal] = useState(false);

  const wordToPlayInput: React.RefObject<HTMLInputElement> = useRef(null);

  const handleInputChange = (word: string, rack: Tile[], play: Tile[]) => {
    const copyRack = [...rack];

    if (word.length > play.length) {
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
        // The play is now everything from before plus new
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

  return (
    <div className={styles.controls}>
      <Board />
      <h4>
        <div className={styles.invalidPlayError}>{errorMessage}</div>
        <TileRack tileRack={playTiles} />
      </h4>
      <div>
        <input
          name="wordToPlay"
          value={wordToPlay}
          onChange={(ev) => {
            handleInputChange(ev.target.value, tileRack, playTiles);
          }}
          ref={wordToPlayInput}
        />
      </div>
      <div>
        {currentPlayerHasTurn && (
          <button
            onClick={() => {
              checkWord(playTiles);
            }}
          >
            play tiles
          </button>
        )}
        {currentPlayerHasTurn && (
          <button
            onClick={() => {
              if (playIsValid(playTiles, tileRack)) {
                dispatch(updatePlayTiles([]));
                exchangeTiles(playTiles);
                setWordToPlay("");
                setPlayed(true);
              }
            }}
          >
            exchange tiles
          </button>
        )}
        <button onClick={() => dispatch(shuffleRack())}>shuffle rack</button>
      </div>

      <h4>
        <TileRack tileRack={displayTileRack} />
      </h4>

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
            wordToPlayInput.current?.focus();
          }}
        />
      </Modal>
    </div>
  );
};

export default GameBoard;
