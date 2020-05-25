import React from "react";
import styles from "./home.module.css";
import RecentGame from "./RecentGame";
import { clearRecentGames } from "../../app/localStorage";

type GameListProps = {
  games: UserGameInfo[];
};

const TurnList = (props: GameListProps) => {
  const { games } = props;

  return (
    <div>
      <h5>Recent games</h5>
      <ul className={styles.gameList}>
        {games.map((g) => {
          return <RecentGame key={g.gameID} game={g} />;
        })}
      </ul>
      <button
        onClick={() => {
          clearRecentGames();
          window.location.reload();
        }}
      >
        clear recent games
      </button>
    </div>
  );
};

export default TurnList;
