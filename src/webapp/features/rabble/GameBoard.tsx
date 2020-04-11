import React, { useState, useEffect } from "react";
import styles from "./GameBoard.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, shuffleRack, updateTiles } from "./rackSlice";
import { playIsValid } from "../../../game/tileBag";

import TurnList from "./TurnList";

type GameBoardProps = {
  G: Game;
  ctx: GameContext;
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

const GameBoard = (props: GameBoardProps) => {
  const {
    playerID,
    G: { players, turns },
    moves: { drawTiles, playWord, exchangeTiles, checkWord },
    events: { endTurn },
    ctx: { currentPlayer }
  } = props;

  // Pull info for the current player
  const { tileRack, currentPlay } = players[playerID];

  const currentPlayIsValid = currentPlay.valid;

  // Update the rack tiles in the local reducer with the rack tiles from the server
  const dispatch = useDispatch();
  const displayTileRack = useSelector(selectTileRack);
  useEffect(() => {
    dispatch(updateTiles(tileRack));
  }, [dispatch, tileRack]);

  // If the current play is marked valid, run playWord
  useEffect(() => {
    if (currentPlayIsValid) {
      console.log("PLAYING VALID WORD", wordToPlay);
      playWord(wordToPlay);
      setWordToPlay("");
      setPlayed(true);
    }
  }, [currentPlayIsValid]);

  const [wordToPlay, setWordToPlay] = useState("");

  // TODO - endTurn comes too soon after playWord.
  // How can we fix the timing issue?
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    if (played) {
      setTimeout(() => {
        endTurn();
        setPlayed(false);
      }, 1000);
    }
  }, [played, endTurn]);

  // Scores should be part of the non-secret sauce instead
  const playerScoreFromTurns = (id: string) =>
    turns
      .filter(t => t.playerID === id)
      .map(t => t.score)
      .reduce((sum: number, score: number) => sum + score, 0);

  return (
    <div className={styles.board}>
      <h2 className={styles.heading}>Welcome Player {playerID}!</h2>
      <h3 className={styles.subheading}>Now Playing: {currentPlayer}</h3>
      <TurnList turns={turns} />
      <div>
        <input
          name="wordToPlay"
          value={wordToPlay}
          onChange={ev => setWordToPlay(ev.target.value)}
        />
      </div>
      <div>{playIsValid(wordToPlay, tileRack) && <strong>Valid</strong>}</div>
      <div>
        <button
          onClick={() => {
            checkWord(wordToPlay);
            // setPlayed(true);
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
            // TODO VALID CHECK YIKES
            exchangeTiles(wordToPlay);
            setWordToPlay("");
            // setPlayed(true);
          }}
        >
          exchange tiles
        </button>
        <button onClick={() => dispatch(shuffleRack())}>shuffle rack</button>
        <button onClick={() => endTurn()}>end turn</button>
      </div>
      <h4>{displayTileRack.map(t => t.letter).join(" ")}</h4>
      <h5 className={styles.subheading}>Scores</h5>
      <ul className={styles.scoreList}>
        <li>
          <span>Player 0: </span>
          <span style={{ float: "right" }}>{playerScoreFromTurns("0")}</span>
        </li>
        <li>
          <span>Player 1: </span>
          <span style={{ float: "right" }}>{playerScoreFromTurns("1")}</span>
        </li>
      </ul>
    </div>
  );
};

export default GameBoard;
