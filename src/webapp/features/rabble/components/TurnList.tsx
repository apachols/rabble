import React from "react";
import styles from "./TurnList.module.css";
import Turn from "./Turn";

type TurnListProps = {
  turns: Turn[];
  remainingTileCount: number;
};

const TurnList = ({ turns, remainingTileCount }: TurnListProps) => (
  <div>
    <table className={styles.turnTable}>
      <tbody>
        <tr>
          <th>#</th>
          <th className={styles.playerAndRemainingTilesHeader}>
            <span>Player</span>
            <span className={styles.remainingTileCount}>
              {remainingTileCount}
            </span>
          </th>
          <th>Word</th>
          <th>Score</th>
        </tr>
        {turns.map((t, idx) => {
          return <Turn key={`${t.turnID}-${idx}`} turn={t} />;
        })}
      </tbody>
    </table>
  </div>
);

export default TurnList;
