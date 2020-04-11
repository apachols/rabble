import React from "react";

import Engine from "./engine";

import { useParams } from "react-router-dom";

import { getPlayerGame } from "../../app/localStorage";

const RabbleGameView = () => {
  const { gameID } = useParams();

  if (!gameID) {
    return <div>Game ID Missing</div>;
  }

  const url = new URL(window.location.href);
  const pid = url.searchParams.get("pid") || "0";

  const { playerID, playerCredentials } = getPlayerGame(gameID);

  console.log(playerID, playerCredentials);

  return (
    <Engine
      playerID={playerID}
      gameID={gameID}
      credentials={playerCredentials}
    />
  );
};

export default RabbleGameView;
