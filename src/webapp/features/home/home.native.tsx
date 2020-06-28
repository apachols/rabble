import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../app/asyncStorage";
import GameList from "./GameList.native";
import { StyleSheet, ScrollView, Text } from 'react-native';
import { Link } from 'react-router-native';

const Home = () => {
  const [nickname, setNickname] = useState('');
  const [gamesByID, setGamesByID] = useState<Games>({});
  const [hasRetrieved, setHasRetrieved] = useState(false);

  const checkUserInfo = async () => {
    const userInfo = await getUserInfo();
    setNickname(userInfo.nickname);
    setGamesByID(userInfo.games);
    setHasRetrieved(true);
  };

  useEffect(() => {
    if (!hasRetrieved) {
      checkUserInfo();
    }
  });

  const arrayOfGames = Object.keys(gamesByID).map(key => gamesByID[key]);  // @TODO help??

  let greeting = "Welcome to Rabble!";
  if (nickname) {
    greeting = `Welcome, ${nickname}`;
  }

  return (
    <ScrollView>
      <Text>{greeting}</Text>
      <Link to="/create"><Text>CREATE</Text></Link>
      {arrayOfGames && arrayOfGames.length > 0 && <GameList games={arrayOfGames} />}
    </ScrollView>
  );
};

export default Home;
