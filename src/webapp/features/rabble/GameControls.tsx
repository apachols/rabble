import React, { useState, useEffect, useRef } from "react";
import styles from "./GameBoard.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, shuffleRack, updateRackTiles } from "./rackSlice";
import { selectPlayTiles, updatePlayTiles } from "./playSlice";
import { playIsValid, pullPlayTilesFromRack } from "../../../game/tileBag";

import TileRack from "./components/TileRack";
import Modal from "./components/Modal";
import ChooseBlank from "./components/ChooseBlank";

type GameControlsProps = {
  G: Game;
  playerID: string;
  moves: {
    drawTiles: () => void;
    exchangeTiles: (tiles: Tile[]) => void;
    playWord: (word: Tile[]) => void;
    checkWord: (word: Tile[]) => void;
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

  // If the current play is marked valid, run playWord
  useEffect(() => {
    if (currentPlayIsValid && playTiles.length > 0) {
      console.log("playing", playTiles);
      playWord(playTiles);
      dispatch(updatePlayTiles([]));
      setWordToPlay("");
      setPlayed(true);
    }
  }, [currentPlayIsValid, playTiles]);

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
        console.log("add");
        const endOfWord = word.slice(play.length);
        if (endOfWord.includes(" ")) {
          setShowModal(true);
        }
        const tiles = pullPlayTilesFromRack(endOfWord, copyRack);
        dispatch(updatePlayTiles([...playTiles, ...tiles]));
        dispatch(updateRackTiles(copyRack));
        setWordToPlay(word);
      } catch (err) {
        // TODO this should handle a specific error
        console.error(err);
      }
    } else if (word.length === play.length) {
      console.log("eql");
    } else {
      const tiles = pullPlayTilesFromRack(word, copyRack);
      dispatch(updatePlayTiles([...playTiles, ...tiles]));
      dispatch(updateRackTiles(copyRack));
      setWordToPlay(word);
    }
  };

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
            handleInputChange(ev.target.value, tileRack, playTiles);
          }}
          ref={wordToPlayInput}
        />
      </div>
      <div>
        <button
          onClick={() => {
            checkWord(playTiles);
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
              dispatch(updatePlayTiles([]));
              exchangeTiles(playTiles);
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
            setShowModal(false);
            const tiles = [...playTiles];
            const letters = tiles.map((t) => t.letter).join("");
            setWordToPlay(letters);
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
