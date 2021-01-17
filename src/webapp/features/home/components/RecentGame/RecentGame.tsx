import React from "react";
import { Link } from "react-router-dom";
import styles from "./RecentGame.module.css";
import RecentGameParticipant from "../RecentGameParticipant/RecentGameParticipant";

// interface GameParticipantProps {
//   person: string
//   score: string
// }

type GameProps = {
  game: UserGameInfo;
};

const RecentGame = (props: GameProps) => {
  const {
    game: { gameID, scoreList, createdAt },
  } = props;

  // const content = () => {
  //   if (scoreList) {
  //     const scoreListAsString = Object.keys(scoreList)
  //       .map((pid) => `${scoreList[pid].nickname}: ${scoreList[pid].score}`)
  //       .join(", ");
  //     // Newest way
  //     if (createdAt) {
  //       return `${createdAt} - ${scoreListAsString}`;
  //     }
  //     // Newer way
  //     return scoreListAsString;
  //   }
  //   // Old way (delete me)
  //   return gameID;
  // };

  return (
    <Link className={styles.recentGame} to={`/game/${gameID}`}>
      {/* <li>{content()}</li> */}
      <li>
        {!!scoreList &&
          Object.keys(scoreList).map((pid) => (
            <RecentGameParticipant
              nickname={scoreList[pid].nickname}
              score={scoreList[pid].score}
            />
          ))}
      </li>
      <div className={styles.createdAt}>{createdAt}</div>
    </Link>
  );
};

export default RecentGame;
