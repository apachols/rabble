import React from "react";
import styles from "./home.module.css";
import { getUserInfo } from "../../app/localStorage";
import GameList from "./components/GameList/GameList";
import { Link } from "react-router-dom";
import RabbleLogo from "../rabble_logo/rabbleLogo";

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
    <>
      <RabbleLogo />
      <div className={styles.content}>
        <h3>{greeting}</h3>
        {arrayOfGames && arrayOfGames.length ? (
          <GameList games={arrayOfGames} />
          ) : (
            <Link to="/create">New Game</Link>
            )}
      </div>
    </>
  );
};

export default Home;
