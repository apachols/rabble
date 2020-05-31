import React from "react";

type TileProps = {
  gameover: GameOver;
};

const GameOver = ({ gameover }: TileProps) => (
  <h2>
    {gameover?.draw ? (
      "You Tied! Weird!"
    ) : (
      <>
        <div style={{ color: "red", display: "inline-block" }}>
          {gameover?.winner}
        </div>{" "}
        wins!
      </>
    )}
  </h2>
);

export default GameOver;
