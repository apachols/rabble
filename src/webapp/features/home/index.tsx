import React from "react";
import styles from "./home.module.css";
import { getUserInfo } from "../../app/localStorage";
import GameList from "./components/GameList/GameList";
import { Link } from "react-router-dom";
import Button from "../rabble/components/Button/Button";

const Home = () => {
  const userInfo = getUserInfo();

  const nickname = userInfo.nickname;
  const gamesByID = userInfo.games;

  const arrayOfGames = Object.keys(gamesByID)
    .map((key) => gamesByID[key])
    .sort((a, b) => {
      let left = Date.parse(a.createdAt);
      let right = Date.parse(b.createdAt);
      return left > right ? -1 : 1;
    });

  let greeting = "Welcome to Rabble!";
  if (nickname) {
    greeting = `Welcome back,`;
  }

  return (
    <div className={styles.content}>
      <div className={styles.greetingWrapper}>
        <h2 className={styles.greeting}>{greeting}</h2>
        <h4 className={styles.nickName}>
          {nickname &&
            (nickname.length > 15
              ? nickname.substring(0, 15) + "..."
              : nickname)}
        </h4>
      </div>
      {arrayOfGames && arrayOfGames.length ? (
        <GameList games={arrayOfGames} />
      ) : (
        <Link to="/create">
          <Button content="New Game" onClick={() => {}} textColor="#fffaf0" />
        </Link>
      )}
    </div>
  );
};

export default Home;
