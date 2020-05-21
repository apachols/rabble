import React from "react";
import styles from "./Turn.module.css";

type TurnProps = {
  turn: Turn;
};

const Turn = (props: TurnProps) => {
  const {
    turn: { tiles, playerID, score, nickname },
  } = props;
  return (
    <tr>
      <td className={styles.player}>
        <span>{nickname}</span>
        <span className={styles.playerID}>{playerID}</span>
      </td>
      <td>{tiles.map((t) => t.letter)}</td>
      <td className={styles.score}>{score}</td>
    </tr>
  );
};

export default Turn;
