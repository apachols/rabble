import React from "react";
import styles from "./GameScreen.module.css";
import { useParams } from "react-router-dom";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls";

const GameScreen = (props: GameBoardProps) => {
  const {
    G: { turns, scores },
    ctx: { currentPlayer, gameover },
  } = props;

  const { gameID } = useParams();

  const displayScores = gameover ? gameover.finalScores : scores;

  return (
    <div className={styles.board}>
      <GameControls nowPlaying={currentPlayer} {...props} />

      <div>
        <span>
          <strong>Invite a friend: </strong>
        </span>
        <div>{`${window.location.origin}/join/${gameID}`}</div>
      </div>

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

      <h5 className={styles.subheading}>Turns</h5>
      <TurnList turns={turns} />
    </div>
  );
};

export default GameScreen;
