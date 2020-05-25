import React, { useRef } from "react";
import styles from "./GameScreen.module.css";
import { useParams } from "react-router-dom";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls";
import {
  getUserInfo,
  getPlayerGame,
  updatePlayerGame,
} from "../../app/localStorage";
import ThemeSelector from "./components/ThemeSelector";

import ScoreDisplay from "./components/ScoreDisplay";

const GameScreen = (props: GameBoardProps) => {
  const {
    G: { turns, scores, scoreList },
    ctx: { currentPlayer, gameover },
  } = props;

  const { gameID } = useParams();

  const { nickname } = getUserInfo();
  const localGameInfo = getPlayerGame(gameID || "");
  const { playerID } = localGameInfo;
  const localScoreList = localGameInfo.scoreList;
  const playerName = !nickname ? `Player ${playerID}` : nickname;
  const otherPlayerID = playerID === "0" ? "1" : "0";
  const displayScores = gameover ? gameover.finalScores : scores;

  const useScoreList = gameover?.scoreList || scoreList;

  // TODO - replace this with server side game history for players
  if (JSON.stringify(localScoreList) !== JSON.stringify(useScoreList)) {
    updatePlayerGame(gameID, { scoreList: useScoreList });
  }

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

      <TurnList turns={turns} />
      <div className={styles.themeSelectorContainer}>
        <ThemeSelector />
      </div>
    </div>
  );
};

export default GameScreen;
