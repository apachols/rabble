import React, { useEffect } from "react";
import styles from "./GameBoard.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, shuffleRack, updateTiles } from "./rackSlice";

type PlayerInfo = {
  tileRack: Array<Tile>;
};

type GameBoardProps = {
  playerID: string;
  G: {
    players: {
      [key: string]: PlayerInfo;
    };
  };
  moves: {
    drawTiles: () => void;
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
    playerID,
    G: { players },
    moves: { drawTiles },
    events: { endTurn },
    ctx: { currentPlayer }
  } = props;

  const { tileRack } = players[playerID];

  const dispatch = useDispatch();
  const displayTileRack = useSelector(selectTileRack);

  useEffect(() => {
    dispatch(updateTiles(tileRack));
  }, [dispatch, tileRack]);

  const message = JSON.stringify(displayTileRack.map(t => t.letter));

  return (
    <div className={styles.board}>
      <h2 className={styles.heading}>Welcome Player {playerID}!</h2>
      <h3 className={styles.subheading}>Now Playing: {currentPlayer}</h3>
      <div>
        <button onClick={() => drawTiles()}>draw tiles</button>
        <button onClick={() => dispatch(shuffleRack())}>shuffle rack</button>
        <button onClick={() => endTurn()}>end turn</button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default GameBoard;
