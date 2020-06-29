import React, { useEffect, useState } from "react";
import styles from "./GameScreen.module.css";
import { useParams } from "react-router-native";

import TurnList from "./components/TurnList";
import GameControls from "./GameControls.native";
import { getPlayerGame, updatePlayerGame } from "../../app/asyncStorage";
import InviteLink from "./components/InviteLink";

import ScoreDisplay from "./components/ScoreDisplay";

import { Text, ActivityIndicator, ScrollView } from 'react-native';

const GameScreen = (props: GameBoardProps) => {
  console.log('GamesScreen props:');
  console.log(props);
  // const {
  //   G: { turnsReverse, scoreList, remainingTileCount },
  //   ctx: { currentPlayer, gameover },
  // } = props;
  

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

  if (!props.G || !props.ctx) {
    return <ActivityIndicator />;
  }

  if (!localGameInfo) {
    return <ActivityIndicator />;
  }

  const {
    G: { turnsReverse, scoreList, remainingTileCount },
    ctx: { currentPlayer, gameover },
  } = props;

  console.log('game info:', localGameInfo);

  const localScoreList = localGameInfo.scoreList;
  const useScoreList = gameover?.scoreList || scoreList;
  const useTurns = gameover?.finalTurns || turnsReverse || [];

  // TODO - replace this with server side game history for players
  if (JSON.stringify(localScoreList) !== JSON.stringify(useScoreList)) {
    updatePlayerGame(gameID, { scoreList: useScoreList });
  }

  return (
    <ScrollView>
      <Text>GAME SCREEN GOES HERE</Text>
      <GameControls {...props} />
    </ScrollView>
    
    // <div className={styles.board}>
    //   <div className={styles.topButtonContainer}>
    //     <InviteLink gameID={gameID} />
    //   </div>

    //   <ScoreDisplay scoreList={useScoreList} />

    //   <GameControls nowPlaying={currentPlayer} {...props} />

    //   <TurnList remainingTileCount={remainingTileCount} turns={useTurns} />

    //   <div className={styles.themeSelectorContainer}>
    //     <ThemeSelector />
    //   </div>
    // </div>
  );
};

export default GameScreen;
