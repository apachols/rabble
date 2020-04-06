import React, { useState, useEffect } from "react";
import styles from "./GameBoard.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, shuffleRack, updateTiles } from "./rackSlice";
import { playIsValid } from "../../../game/tileBag";

type GameBoardProps = {
  G: Game;
  ctx: GameContext;
  playerID: string;
  moves: {
    drawTiles: () => void;
    playWord: (word: string) => void;
  };
  events: {
    endTurn: any;
  };
};

const GameBoard = (props: GameBoardProps) => {
  const {
    playerID,
    G: { players, turns },
    moves: { drawTiles, playWord },
    events: { endTurn },
    ctx: { currentPlayer }
  } = props;

  // Update the rack tiles in the local reducer with the rack tiles from the server
  const { tileRack } = players[playerID];
  const dispatch = useDispatch();
  const displayTileRack = useSelector(selectTileRack);
  useEffect(() => {
    dispatch(updateTiles(tileRack));
  }, [dispatch, tileRack]);

  const [wordToPlay, setWordToPlay] = useState("");

  return (
    <div className={styles.board}>
      <h2 className={styles.heading}>Welcome Player {playerID}!</h2>
      <h3 className={styles.subheading}>Now Playing: {currentPlayer}</h3>
      <div>
        <ul className={styles.turnList}>
          {turns.map(word => {
            return <li>{word.map(t => t.letter).join("")}</li>;
          })}
        </ul>
      </div>
      <div>
        <input
          name="wordToPlay"
          value={wordToPlay}
          onChange={ev => setWordToPlay(ev.target.value)}
        />
      </div>
      <div>{playIsValid(wordToPlay, tileRack) && <strong>Valid</strong>}</div>
      <div>
        <button onClick={() => playWord(wordToPlay)}>play tiles</button>
        <button onClick={() => drawTiles()}>draw tiles</button>
        <button onClick={() => dispatch(shuffleRack())}>shuffle rack</button>
        <button onClick={() => endTurn()}>end turn</button>
      </div>
      <p>{JSON.stringify(displayTileRack.map(t => t.letter))}</p>
    </div>
  );
};

export default GameBoard;
