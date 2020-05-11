import React, { useState, useEffect, useRef } from "react";
import styles from "./GameControls.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, shuffleRack, updateRackTiles } from "./rackSlice";
import {
  updatePlayTiles as boardPlayTiles,
  selectPlayTiles,
  canPlayOneMoreTile,
  selectPlaySquares,
  changeSquareSelection,
} from "./boardSlice";
import {
  checkForPlayTilesInRack,
  pullPlayTilesFromRack,
  tilesFromString,
} from "../../../game/tileBag";

import TileRack from "./components/TileRack";
import Modal from "./components/Modal";
import ChooseBlank from "./components/ChooseBlank";

import Board from "./board/Board";

const GameBoard = (props: GameBoardProps) => {
  const {
    playerID,
    ctx: { currentPlayer, gameover },
    G: { players, gameBoard },
    moves: { playWord, exchangeTiles, checkWord, cleanUp },
    events: { endTurn },
  } = props;

  // Pull info for the current player
  const { tileRack, currentPlay } = players[playerID];
  const nowPlaying = currentPlayer;
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
  // But now we are doing squares...
  const playSquares = useSelector(selectPlaySquares);

  // If the current play is marked valid, run playWord
  useEffect(() => {
    if (currentPlayIsValid && playSquares.length > 0) {
      playWord(playSquares);
      dispatch(boardPlayTiles([]));
      dispatch(changeSquareSelection(null));
      setWordToPlay("");
      setPlayed(true);
    }
  }, [currentPlayIsValid, playSquares, dispatch, playWord]);

  // If the user has played but the word is invalid, clear tiles
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (!currentPlayIsValid && currentPlayTilesLaid?.length) {
      dispatch(boardPlayTiles([]));
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

  const wordToPlayInputRef: React.RefObject<HTMLInputElement> = useRef(null);

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
        dispatch(boardPlayTiles([...play, ...newTiles]));

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
      dispatch(boardPlayTiles([]));
      dispatch(updateRackTiles(copyRack));
      setWordToPlay("");
      setErrorMessage("");
    }
  };

  const gameOverScreen = (
    <h2>
      {gameover?.draw ? "You Tied! Weird!" : `Player ${gameover?.winner} Wins!`}
    </h2>
  );

  // props will be
  // wordToPlay, currentPlayerHasTurn, wordToPlayInputRef(?), onExchange, onPlay, onShuffle
  const buttonsAndInput = (
    <>
      <div>
        <input
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
          <button
            onClick={() => {
              if (checkForPlayTilesInRack(playTiles, tileRack)) {
                dispatch(boardPlayTiles([]));
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
    </>
  );

  return (
    <div className={styles.controls}>
      <Board gameBoard={gameBoard} wordToPlayInputRef={wordToPlayInputRef} />
      <h4>
        <div className={styles.invalidPlayError}>{errorMessage}</div>
        <TileRack tileRack={playTiles} />
      </h4>

      {gameover ? gameOverScreen : buttonsAndInput}

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
            dispatch(boardPlayTiles(tiles));
            wordToPlayInputRef.current?.focus();
          }}
        />
      </Modal>
    </div>
  );
};

export default GameBoard;
