import React from "react";
import { Link } from "react-router-native";
import { Text } from "react-native";

type GameProps = {
  game: UserGameInfo;
};

const RecentGame = (props: GameProps) => {
  const {
    game: { gameID, scoreList, createdAt },
  } = props;

  const content = () => {
    if (scoreList) {
      const scoreListAsString = Object.keys(scoreList)
        .map((pid) => `${scoreList[pid].nickname}: ${scoreList[pid].score}`)
        .join(", ");
      // Newest way
      if (createdAt) {
        return `${createdAt} - ${scoreListAsString}`;
      }
      // Newer way
      return scoreListAsString;
    }
    // Old way (delete me)
    return gameID;
  };

  return (
    <Link to={`/game/${gameID}`}><Text>{content()}</Text></Link>
  );
};

export default RecentGame;
