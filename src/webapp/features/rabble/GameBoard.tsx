import React from "react";
import styles from "./GameBoard.module.css";

type GameBoardProps = {
  G: {
    players: Array<object>;
  };
  moves: {
    drawTiles: any;
  };
  events: {
    endTurn: any;
  };
  ctx: {
    currentPlayer: string;
    gameover?: {
      winner?: number;
      draw?: boolean;
    };
  };
};

const GameBoard = (props: GameBoardProps) => {
  const {
    G: { players },
    moves: { drawTiles },
    events: { endTurn },
    ctx: { currentPlayer }
  } = props;

  const drawTilesClick = () => {
    drawTiles(7);
    console.log(`drawTiles`);
  };

  const message = JSON.stringify(players);

  return (
    <div className={styles.board}>
      <h3>Now Playing: {currentPlayer}</h3>
      <div>
        <button onClick={() => drawTilesClick()}>draw tiles</button>
        <button onClick={() => endTurn()}>end turn</button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default GameBoard;
