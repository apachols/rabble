import React from "react";
import { Link } from "react-router-dom";

type GameProps = {
  game: UserGameInfo;
};

const Turn = (props: GameProps) => {
  const {
    game: { gameID, playerID }
  } = props;
  return (
    <li>
      <Link to={`/game/${gameID}`}>
        {" "}
        {gameID} as Player {playerID}
      </Link>
    </li>
  );
};

export default Turn;
