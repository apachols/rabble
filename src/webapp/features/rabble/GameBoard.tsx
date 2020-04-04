import React, { useState, useEffect } from "react";
import styles from "./GameBoard.module.css";

type GameBoardProps = {
  G: {
    cells: Array<number>;
  };
  moves: {
    clickCell: any;
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
  const [played, setPlayed] = useState(false);
  const {
    G: { cells },
    moves,
    events: { endTurn },
    ctx: { currentPlayer, gameover }
  } = props;

  const { clickCell, drawTiles } = moves;

  const onClick = (id: number) => {
    // clickCell(id);
    drawTiles();
    setPlayed(true);
    console.log(`click ${id}`);
  };

  useEffect(() => {
    if (played && !gameover) {
      // endTurn();
      setPlayed(false);
    }
  }, [endTurn, played, gameover]);

  const message = JSON.stringify(cells);

  if (!cells) {
    return "Error, game config empty or malformed";
  }

  return (
    <div className={styles.board}>
      <h3>Now Playing: {currentPlayer}</h3>
      <div>
        <button onClick={() => onClick(0)}>draw tiles</button>
        <button onClick={() => endTurn()}>end turn</button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default GameBoard;
