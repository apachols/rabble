import React from "react";

type TurnProps = {
  turn: Turn;
};

const Turn = (props: TurnProps) => {
  const {
    turn: { tiles, playerID, score },
  } = props;
  return (
    <li>
      <span>
        [P{playerID}] {tiles.map((t) => t.letter)}
      </span>
      <span style={{ float: "right" }}>{score}</span>
    </li>
  );
};

export default Turn;
