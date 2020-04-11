import React from "react";
import styles from "./home.module.css";
import Game from "./Game";

type GameListProps = {
  games: UserGameInfo[];
};

const TurnList = (props: GameListProps) => {
  const { games } = props;

  return (
    <div>
      <ul className={styles.gameList}>
        {games.map(g => {
          return <Game key={g.gameID} game={g} />;
        })}
      </ul>
    </div>
  );
};

export default TurnList;
