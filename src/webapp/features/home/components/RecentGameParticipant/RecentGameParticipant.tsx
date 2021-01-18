import React from "react";
import styles from "./RecentGameParticipant.module.css";

interface GameParticipantProps {
  nickname: string;
  score: number;
}

const RecentGameParticipant = ({ nickname, score }: GameParticipantProps) => {
  let adjustedNickname = "";
  if (!!nickname && nickname.length > 11) {
    adjustedNickname = nickname.substring(0, 10) + "...";
  } else {
    adjustedNickname = nickname;
  }

  return (
    <div className={styles.participant}>
      <h3 className={styles.nickname}>
        {adjustedNickname ? adjustedNickname : `????`}
      </h3>
      <span className={styles.score}>{score}</span>
    </div>
  );
};

export default RecentGameParticipant;
