import React from "react";
import styles from "./GameBoard.module.css";
import { useParams } from "react-router-dom";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls";

const GameBoard = (props: GameBoardProps) => {
  const {
    playerID,
    G: { turns },
    ctx: { currentPlayer },
  } = props;

  const { gameID } = useParams();

  // Scores should be part of the non-secret sauce instead
  const playerScoreFromTurns = (id: string) =>
    turns
      .filter((t) => t.playerID === id)
      .map((t) => t.score)
      .reduce((sum: number, score: number) => sum + score, 0);

  return (
    <div className={styles.board}>
      <div>
        <span>
          <strong>Invite a friend: </strong>
        </span>
        <div>{`${window.location.origin}/join/${gameID}`}</div>
      </div>

      <h2 className={styles.heading}>Welcome Player {playerID}!</h2>
      <h3 className={styles.subheading}>Now Playing: {currentPlayer}</h3>

      <GameControls nowPlaying={currentPlayer} {...props} />

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

      <TurnList turns={turns} />
    </div>
  );
};

export default GameBoard;
