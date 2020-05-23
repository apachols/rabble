import React from "react";
import styles from "./TurnList.module.css";
import Turn from "./Turn";

type TurnListProps = {
  turns: Turn[];
};

const TurnList = (props: TurnListProps) => {
  const { turns } = props;

  return (
    <div>
      <table className={styles.turnTable}>
        <tr>
          <th>Player</th>
          <th>Word</th>
          <th>Score</th>
        </tr>
        {turns.map((t) => {
          return <Turn key={t.turnID} turn={t} />;
        })}
      </table>
    </div>
  );
};

export default TurnList;
