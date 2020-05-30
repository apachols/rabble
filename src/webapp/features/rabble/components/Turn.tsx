import React from "react";
import styles from "./Turn.module.css";

type TurnProps = {
  turn: Turn;
};

const Turn = (props: TurnProps) => {
  const {
    turn: { tiles, score, nickname, turnID },
  } = props;
  return (
    <tr className={styles.turnRow}>
      <td className={styles.turnNumber}>
        <span>{turnID}</span>
      </td>
      <td className={styles.player}>
        <div className={styles.nickname}>{nickname}</div>
      </td>
      <td>{tiles.map((t) => t.letter)}</td>
      <td className={styles.score}>{score}</td>
    </tr>
  );
};

export default Turn;
