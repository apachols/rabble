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
import InviteLink from "./components/InviteLink";

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

  return (
    <div className={styles.board}>
      <div className={styles.topButtonContainer}>
        <InviteLink gameID={gameID} />
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
