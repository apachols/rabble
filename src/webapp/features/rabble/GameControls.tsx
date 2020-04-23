import React, { useState, useEffect, useRef } from "react";
import styles from "./GameBoard.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, shuffleRack, updateRackTiles } from "./rackSlice";
import { selectPlayTiles, updatePlayTiles } from "./playSlice";
import {
  playIsValid,
  tilesFromString,
  pullPlayTilesFromRack,
} from "../../../game/tileBag";

import TileRack from "./components/TileRack";
import Modal from "./components/Modal";
import ChooseBlank from "./components/ChooseBlank";

type GameControlsProps = {
  G: Game;
  playerID: string;
  moves: {
    drawTiles: () => void;
    exchangeTiles: (tiles: string) => void;
    playWord: (word: string) => void;
    checkWord: (word: string) => void;
  };
  events: {
    endTurn: any;
  };
};

const GameBoard = (props: GameControlsProps) => {
  const {
    playerID,
    G: { players },
    moves: { drawTiles, playWord, exchangeTiles, checkWord },
    events: { endTurn },
  } = props;

  // Pull info for the current player
  const { tileRack, currentPlay } = players[playerID];

  const currentPlayIsValid = currentPlay.valid;

  const [wordToPlay, setWordToPlay] = useState("");

  // Update the rack tiles in the local reducer with the rack tiles from the server
  const dispatch = useDispatch();
  const displayTileRack = useSelector(selectTileRack);
  useEffect(() => {
    dispatch(updateRackTiles(tileRack));
  }, [dispatch, tileRack]);

  // These are tiles with which the player is trying to make a word
  const playTiles = useSelector(selectPlayTiles);
  useEffect(() => {
    const tiles = tilesFromString(wordToPlay);
    if (wordToPlay.includes(" ")) {
      console.log("BLANK");
      setShowModal(true);
    }
    dispatch(updatePlayTiles(tiles));
  }, [dispatch, wordToPlay]);

  // If the current play is marked valid, run playWord
  useEffect(() => {
    if (currentPlayIsValid) {
      playWord(wordToPlay);
      setWordToPlay("");
      setPlayed(true);
    }
  }, [currentPlayIsValid, wordToPlay, playWord]);

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

  const setValidWordToPlay = (word: string, rack: Tile[]) => {
    if (word === "" || playIsValid(word, rack)) {
      setWordToPlay(word);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const wordToPlayInput: React.RefObject<HTMLInputElement> = useRef(null);

  return (
    <div className={styles.board}>
      <h4>
        <TileRack tileRack={playTiles} />
      </h4>
      <div>
        <input
          name="wordToPlay"
          value={wordToPlay}
          onChange={(ev) => {
            setValidWordToPlay(ev.target.value, tileRack);
          }}
          ref={wordToPlayInput}
        />
      </div>
      <div>
        <button
          onClick={() => {
            checkWord(wordToPlay);
          }}
        >
          play tiles
        </button>
        <button
          onClick={() => {
            drawTiles();
          }}
        >
          draw tiles
        </button>
        <button
          onClick={() => {
            if (playIsValid(wordToPlay, tileRack)) {
              exchangeTiles(wordToPlay);
              setWordToPlay("");
              setPlayed(true);
            }
          }}
        >
          exchange tiles
        </button>
        <button onClick={() => dispatch(shuffleRack())}>shuffle rack</button>
        <button onClick={() => endTurn()}>end turn</button>
      </div>

      <h4>
        <TileRack tileRack={displayTileRack} />
      </h4>

      <Modal showModal={showModal}>
        <ChooseBlank
          selectTile={(selectedTile: Tile) => {
            console.log(selectedTile);
            setShowModal(false);
            const tiles = tilesFromString(wordToPlay);
            const blank = tiles.find((t) => t.blank);
            if (blank) {
              blank.letter = "Q";
              blank.value = 0;
              console.log(blank.value);
            } else {
              throw new Error("ChooseBlank did not find a blank...");
            }
            dispatch(updatePlayTiles(tiles));
            setWordToPlay(tiles.map((t) => t.letter).join(""));
            wordToPlayInput.current?.focus();
          }}
        />
      </Modal>
    </div>
  );
};

export default GameBoard;
