import React, { useRef } from "react";
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

  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  return (
    <div className={styles.board}>
      <div>
        <input
          readOnly
          ref={inputRef}
          className={styles.clipboardInput}
          value={`${window.location.origin}/join/${gameID}`}
        />
        <button
          onClick={(event) => {
            const theInput = inputRef.current as HTMLInputElement;
            if (navigator.userAgent.match(/ipad|iphone/i)) {
              const range = document.createRange();
              range.selectNodeContents(theInput);
              const selection = window.getSelection();
              selection?.removeAllRanges();
              selection?.addRange(range);
              theInput.setSelectionRange(0, 999999);
            } else {
              theInput.select();
            }
            document.execCommand("copy");
            theInput.blur();
          }}
        >
          <strong>Invite a friend! (Click to copy) </strong>
        </button>
      </div>

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

      <h5 className={styles.subheading}>Turns</h5>
      <TurnList turns={turns} />
    </div>
  );
};

export default GameScreen;
