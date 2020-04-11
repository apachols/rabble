import React from "react";
import styles from "./home.module.css";
import { getUserInfo } from "../../app/localStorage";
import GameList from "./GameList";
import { Link } from "react-router-dom";

const Home = () => {
  const userInfo = getUserInfo();

  const nickname = userInfo.nickname;
  const gamesByID = userInfo.games;

  const arrayOfGames = Object.keys(gamesByID).map(key => gamesByID[key]);

  let greeting = "Welcome to Rabble!";
  if (nickname) {
    greeting = `Welcome, ${nickname}`;
  }

  return (
    <div className={styles.content}>
      <h3>{greeting}</h3>
      {arrayOfGames && arrayOfGames.length ? (
        <GameList games={arrayOfGames} />
      ) : (
        <Link to="/create">New Game</Link>
      )}
    </div>
  );
};

export default Home;
