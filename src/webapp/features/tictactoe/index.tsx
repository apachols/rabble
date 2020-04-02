import React from "react";
import Engine from "./engine";

const TicTacToe = () => {
  const url = new URL(window.location.href);
  const pid = url.searchParams.get("pid") || "0";

  return (
    <div>
      <div>
        <Engine playerID={pid} gameID={"lDYa1GVeM"} />
      </div>
    </div>
  );
};

export default TicTacToe;
