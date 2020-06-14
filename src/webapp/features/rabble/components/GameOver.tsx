import React from "react";

type GameOverProps = {
  gameover: GameOver;
};

const GameOver = ({ gameover }: GameOverProps) => (
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
