import React, { useRef } from "react";
import styles from "./GameScreen.module.css";
import { useParams } from "react-router-dom";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls";
import { getUserInfo, getPlayerGame } from "../../app/localStorage";
import ThemeSelector from "./components/ThemeSelector";

import ScoreDisplay from "./components/ScoreDisplay";

const GameScreen = (props: GameBoardProps) => {
  const {
    G: { turns, scores, scoreList },
    ctx: { currentPlayer, gameover },
  } = props;

  const { gameID } = useParams();

  const { nickname } = getUserInfo();
  const { playerID } = getPlayerGame(gameID || "");
  const playerName = !nickname ? `Player ${playerID}` : nickname;
  const otherPlayerID = playerID === "0" ? "1" : "0";
  const displayScores = gameover ? gameover.finalScores : scores;

  const useScoreList = gameover?.scoreList || scoreList;

  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  return (
    <div className={styles.board}>
      <div className={styles.topButtonContainer}>
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
      <ScoreDisplay scoreList={useScoreList} />

      <GameControls nowPlaying={currentPlayer} {...props} />
      <h4 className={styles.subheading}>Scores</h4>
      <ul className={styles.scoreList}>
        <li>
          <span>
            [P{playerID}] {playerName}
          </span>
          <span style={{ float: "right" }}>{displayScores[playerID]}</span>
        </li>
        <li>
          <span>[P{otherPlayerID}] Opponent</span>
          <span style={{ float: "right" }}>{displayScores[otherPlayerID]}</span>
        </li>
      </ul>

      <h4 className={styles.subheading}>Turns</h4>
      <TurnList turns={turns} />
      <div className={styles.themeSelectorContainer}>
        <ThemeSelector />
      </div>
    </div>
  );
};

export default GameScreen;
