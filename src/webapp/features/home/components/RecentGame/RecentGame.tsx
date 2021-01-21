import React from "react";
import { Link } from "react-router-dom";
import styles from "./RecentGame.module.css";
import RecentGameParticipant from "../RecentGameParticipant/RecentGameParticipant";

type GameProps = {
  game: UserGameInfo;
};

const RecentGame = (props: GameProps) => {
  const {
    game: { gameID, scoreList, createdAt },
  } = props;

  return (
    <Link className={styles.recentGame} to={`/game/${gameID}`}>
      <li>
        {!!scoreList &&
          Object.keys(scoreList).map((pid) => (
            <RecentGameParticipant
              nickname={scoreList[pid].nickname}
              score={scoreList[pid].score}
              key={`${gameID}${pid}`}
            />
          ))}
      </li>
      <div className={styles.vs}>vs</div>
      <div className={styles.createdAt}>Started: {createdAt}</div>
    </Link>
  );
};

export default RecentGame;
