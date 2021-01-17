import React, { useState, useEffect } from "react";

import { Client } from "boardgame.io/react";
import GameScreen from "./GameScreen";
import Rabble from "../../../game/rabble";
import { SocketIO } from "boardgame.io/multiplayer";

import { useParams } from "react-router-dom";

import { getPlayerGame } from "../../app/localStorage";

const RabbleGameView = () => {
  const { gameID } = useParams();

  // When mobile clients are locked, they sometimes lose connection to the server.
  // The 'visibilitychange' event happens when a browser tab becomes visible again
  // after the phone is locked (or the user switches back to this tab).
  const [visibleAt, setVisibleAt] = useState(0);
  const onVisibilityChange = (ev: any) => {
    setVisibleAt(ev.timeStamp);
  };
  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  });

  if (!gameID) {
    return <div>Game ID Missing</div>;
  }
  const gameInfo = getPlayerGame(gameID);
  if (!gameInfo) {
    // TODO, react router recommends doing this with <Redirect> instead
    window.location.href = `/join/${gameID}`;
  }

  const { playerID, playerCredentials } = gameInfo;

  // Render the game engine. There's an extra layer of function calling
  // here because React was too smart to rerender when we passed in visibleAt
  // (which after all is an unnecessary prop) to the BGIO game client.
  // The below will rerender the engine when the 'visibleAt' timestamp updates.
  const SOCKET_ROOT = `${process.env?.REACT_APP_SOCKET_ROOT || ""}`;
  const socket = SocketIO({ server: SOCKET_ROOT });
  const getEngine = (visibleAt: number) => {
    return Client({
      debug: false,
      game: Rabble({}),
      board: GameScreen,
      multiplayer: socket,
      visibleAt,
    });
  };
  const Engine = getEngine(visibleAt);

  return (
    <Engine
      playerID={playerID}
      matchID={gameID}
      credentials={playerCredentials}
      visibleAt={visibleAt}
    />
  );
};

export default RabbleGameView;
