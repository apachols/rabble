import React from "react";
import styles from "./GameBoard.module.css";
import Turn from "./Turn";

type TurnListProps = {
  turns: Turn[];
};

const TurnList = (props: TurnListProps) => {
  const { turns } = props;

  return (
    <div>
      <ul className={styles.turnList}>
        {turns.map(t => {
          return <Turn key={t.turnID} turn={t} />;
        })}
      </ul>
    </div>
  );
};

export default TurnList;
