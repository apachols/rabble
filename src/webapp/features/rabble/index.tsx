import React from "react";

import Engine from "./engine";

const RabbleGameView = () => {
  const url = new URL(window.location.href);
  const pid = url.searchParams.get("pid") || "0";

  return <Engine playerID={pid} gameID={"GgOTSr93q"} />;
};

export default RabbleGameView;
