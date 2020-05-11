import React from "react";
import styles from "./GameBoard.module.css";
import { useParams } from "react-router-dom";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls";

const GameBoard = (props: GameBoardProps) => {
  const {
    playerID,
    G: { turns, scores },
    ctx: { currentPlayer, gameover },
  } = props;

  const { gameID } = useParams();

  console.log(gameover);
  console.log(`scores`, scores);

  const displayScores = gameover ? gameover.finalScores : scores;

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
          <span style={{ float: "right" }}>{displayScores["0"]}</span>
        </li>
        <li>
          <span>Player 1: </span>
          <span style={{ float: "right" }}>{displayScores["1"]}</span>
        </li>
      </ul>

      <TurnList turns={turns} />
    </div>
  );
};

export default GameBoard;
