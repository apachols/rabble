import React, { useState } from "react";
import styles from "./GameList.module.css";
import RecentGame from "../RecentGame/RecentGame";
import { clearRecentGames } from "../../../../app/localStorage";
import Button from "../../../rabble/components/Button/Button";

type GameListProps = {
  games: UserGameInfo[];
};

const TurnList = (props: GameListProps) => {
  const { games } = props;
  const [gamesListForView, setGamesListForView] = useState(games);

  const handleClearRecentGames = () => {
    clearRecentGames();
    setGamesListForView([]);
  };

  return (
    <div className={styles.RecentGameList}>
      <h3 className={styles.recentTitle}>Recent games</h3>
      <ul className={styles.gameList}>
        {gamesListForView.map((g) => {
          return <RecentGame key={g.gameID} game={g} />;
        })}
      </ul>
      <Button
        onClick={handleClearRecentGames}
        content={"clear recent games"}
        textColor="#f0f6ff"
      />
    </div>
  );
};

export default TurnList;
