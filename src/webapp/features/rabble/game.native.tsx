import React, { useState, useEffect } from "react";

import { Client } from "boardgame.io/react-native";
import GameScreen from "./GameScreen.native";
import Rabble from "../../../game/rabble";
import { SocketIO } from "boardgame.io/multiplayer";

import { useHistory, useParams } from "react-router-native";

import { Text, View } from 'react-native';

import { getPlayerGame } from "../../app/asyncStorage";

const RabbleGameView = () => {
  const { gameID } = useParams();
  const history = useHistory();

  // When mobile clients are locked, they sometimes lose connection to the server.
  // The 'visibilitychange' event happens when a browser tab becomes visible again
  // after the phone is locked (or the user switches back to this tab).
  // const [visibleAt, setVisibleAt] = useState(0);
  const [playerID, setPlayerID] = useState('');
  const [playerCredentials, setPlayerCredentials] = useState('');

  // const onVisibilityChange = (ev: any) => {
  //   setVisibleAt(ev.timeStamp);
  // };
  // useEffect(() => {
  //   document.addEventListener("visibilitychange", onVisibilityChange);
  //   return () =>
  //     document.removeEventListener("visibilitychange", onVisibilityChange);
  // });

  const checkPlayerGame = async () => {
    const gameInfo = await getPlayerGame(gameID);

    if (!gameInfo) {
      history.push(`/join/${gameID}`);
    }
    setPlayerID(gameInfo.playerID);
    setPlayerCredentials(gameInfo.playerCredentials);
  }

  useEffect(() => {
    if (!playerID) {
      checkPlayerGame();
    }
  });

  if (!gameID) {
    return <Text>Game ID Missing</Text>;
  }

  if (!playerCredentials) {
    return <Text>Player Creds Missing</Text>;
  }

  // Render the game engine. There's an extra layer of function calling
  // here because React was too smart to rerender when we passed in visibleAt
  // (which after all is an unnecessary prop) to the BGIO game client.
  // The below will rerender the engine when the 'visibleAt' timestamp updates.
  const SOCKET_ROOT = `${process.env.REACT_APP_SOCKET_ROOT || ""}`;
  const socket = SocketIO({ server: SOCKET_ROOT });
  const getEngine = () => {
    return Client({
      debug: false,
      game: Rabble({}),
      board: GameScreen,
      multiplayer: socket,
      visibleAt: 0
    });
  };
  const Engine = getEngine();
  console.log('my engine:');
  console.log(Engine);

  return (
    <Engine
      playerID={playerID}
      gameID={gameID}
      credentials={playerCredentials}
      visibleAt={0}
    />
  );
};

export default RabbleGameView;
