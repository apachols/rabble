import React, { useRef } from "react";
import styles from "./GameScreen.module.css";
import { useParams } from "react-router-dom";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls";
import { getUserInfo } from "../../app/localStorage";

const GameScreen = (props: GameBoardProps) => {
  const {
    G: { turns, scores },
    ctx: { currentPlayer, gameover },
  } = props;

  const nickname = getUserInfo().nickname;
  const playerName = !nickname ? `Player ${currentPlayer}` : nickname;
  const otherPlayerID = currentPlayer === "0" ? "1" : "0";

  const { gameID } = useParams();

  const displayScores = gameover ? gameover.finalScores : scores;

  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  return (
    <div className={styles.board}>
      <div className={styles.copyInviteLink}>
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
          <span>
            [P{currentPlayer}] {playerName}
          </span>
          <span style={{ float: "right" }}>{displayScores[currentPlayer]}</span>
        </li>
        <li>
          <span>[P{otherPlayerID}] Opponent</span>
          <span style={{ float: "right" }}>{displayScores[otherPlayerID]}</span>
        </li>
      </ul>

      <h5 className={styles.subheading}>Turns</h5>
      <TurnList turns={turns} />
    </div>
  );
};

export default GameScreen;
