import React from "react";
import { Link } from "react-router-dom";

type GameProps = {
  game: UserGameInfo;
};

const RecentGame = (props: GameProps) => {
  const {
    game: { gameID, playerID, scoreList, createdAt },
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
    <li>
      <Link to={`/game/${gameID}`}>{content()}</Link>
    </li>
  );
};

export default RecentGame;
