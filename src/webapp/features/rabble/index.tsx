import React from "react";

import Engine from "./engine";

import { useParams } from "react-router-dom";

const RabbleGameView = () => {
  const { gameID } = useParams();

  const url = new URL(window.location.href);
  const pid = url.searchParams.get("pid") || "0";

  return <Engine playerID={pid} gameID={gameID} />;
};

export default RabbleGameView;
