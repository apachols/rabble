import React, { useEffect, useState } from "react";
import styles from "./GameScreen.module.css";
import { useParams } from "react-router-dom";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls";
import { getPlayerGame, updatePlayerGame } from "../../app/asyncStorage";
import ThemeSelector from "./components/ThemeSelector";
import InviteLink from "./components/InviteLink";

import ScoreDisplay from "./components/ScoreDisplay";
import Loader from "react-loader-spinner";

const GameScreen = (props: GameBoardProps) => {
  const {
    G: { turnsReverse, scoreList, remainingTileCount },
    ctx: { currentPlayer, gameover },
  } = props;

  const [localGameInfo, setLocalGameInfo] = useState<UserGameInfo>();
  const { gameID } = useParams();

  const checkGameInfo = async () => {
    const game = await getPlayerGame(gameID || "");
    setLocalGameInfo(game);
  }

  useEffect(() => {
    if (!localGameInfo) {
      checkGameInfo();
    }
  });

  if (!localGameInfo) {
    return <Loader type="Grid" color="#00BFFF" height={100} width={100} />;
  }
  console.log('game info:', localGameInfo);

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

      <GameControls nowPlaying={currentPlayer} {...props} />

      <TurnList remainingTileCount={remainingTileCount} turns={useTurns} />

      <div className={styles.themeSelectorContainer}>
        <ThemeSelector />
      </div>
    </div>
  );
};

export default GameScreen;
