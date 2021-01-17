import React from "react";
import styles from "./RecentGameParticipant.module.css";

interface GameParticipantProps {
  nickname: string;
  score: number;
}

const RecentGameParticipant = ({ nickname, score }: GameParticipantProps) => {
  return (
    <div className={styles.gameParticipant}>
      `{nickname}: {score}`
    </div>
  );
};

export default RecentGameParticipant;
