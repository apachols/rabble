import React, { useState } from "react";
import styles from "./GameList.module.css";
import RecentGame from "../RecentGame/RecentGame";
import { clearRecentGames } from "../../../../app/localStorage";
import Button from "../../../rabble/components/Button/Button";
import { Link } from "react-router-dom";

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
        {!!gamesListForView.length ? (
          gamesListForView.map((g) => {
            return <RecentGame key={g.gameID} game={g} />;
          })
        ) : (
          <>
            <h6 style={{ color: "gray", marginTop: "20px" }}>
              --No recent games--
            </h6>
          </>
        )}
      </ul>
      {!!gamesListForView.length ? (
        <Button
          onClick={handleClearRecentGames}
          content={"clear recent games"}
          textColor="#f0f6ff"
        />
      ) : (
        <Link to="/create" className="">
          <Button onClick={() => {}} content="New Game" textColor="#fffaf0" />
        </Link>
      )}
    </div>
  );
};

export default TurnList;
