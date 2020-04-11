import React from "react";
import styles from "./GameBoard.module.css";
import Turn from "./Turn";

type TurnListProps = {
  turns: Turn[];
};

const TurnList = (props: TurnListProps) => {
  const { turns } = props;

  // Turn needs a unique ID...
  const key = (turn: Turn) =>
    `${turn.playerID}-${turn.tiles.map(t => t.letter)}`;

  return (
    <div>
      <ul className={styles.turnList}>
        {turns.map(t => {
          return <Turn key={key(t)} turn={t} />;
        })}
      </ul>
    </div>
  );
};

export default TurnList;
