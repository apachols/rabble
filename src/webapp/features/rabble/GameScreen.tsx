import React from "react";
import styles from "./GameScreen.module.css";
import { useParams } from "react-router-dom";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls";
import { getPlayerGame, updatePlayerGame } from "../../app/localStorage";
import ThemeSelector from "./components/ThemeSelector";
import InviteLink from "./components/InviteLink";

import ScoreDisplay from "./components/ScoreDisplay";

const GameScreen = (props: GameBoardProps) => {
  const {
    G: { turnsReverse, scoreList, remainingTileCount },
    ctx: { gameover },
  } = props;

  const { gameID } = useParams();

  const localGameInfo = getPlayerGame(gameID || "");

  const localScoreList = localGameInfo.scoreList;

  const useScoreList = gameover?.scoreList || scoreList;

  const useTurns = gameover?.finalTurns || turnsReverse || [];

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

      <GameControls {...props} />

      <TurnList remainingTileCount={remainingTileCount} turns={useTurns} />

      <div className={styles.themeSelectorContainer}>
        <ThemeSelector />
      </div>
    </div>
  );
};

export default GameScreen;
