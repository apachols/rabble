import React from "react";

import Engine from "./engine";

import { useParams } from "react-router-dom";

import { getPlayerGame } from "../../app/localStorage";

const RabbleGameView = () => {
  const { gameID } = useParams();

  if (!gameID) {
    return <div>Game ID Missing</div>;
  }

  const gameInfo = getPlayerGame(gameID);

  if (!gameInfo) {
    // TODO, react router recommends doing this with <Redirect> instead
    window.location.href = `/join/${gameID}`;
  }

  const { playerID, playerCredentials } = gameInfo;

  return (
    <Engine
      playerID={playerID}
      gameID={gameID}
      credentials={playerCredentials}
    />
  );
};

export default RabbleGameView;
