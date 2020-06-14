import React from "react";
import styles from "./CurrentPlayInfo.module.css";

interface CurrentPlayInfoProps {
  invalidReason: string;
  score: number;
  play: Square[];
}

const invalidReasonDisplay = (invalidReason: string) => {
  if (invalidReason) {
    return <span>{invalidReason}</span>;
  }
  return <span>&nbsp;</span>;
};

const currentPlayScoreDisplay = (score: number, play: Square[]) => {
  if (score && play.length) {
    return <span>Score: {score}</span>;
  }
  return <span>&nbsp;</span>;
};

const CurrentPlayInfo = ({
  invalidReason,
  score,
  play,
}: CurrentPlayInfoProps) => (
  <div className={styles.currentPlayInfoContainer}>
    <div className={styles.invalidPlayError}>
      {invalidReasonDisplay(invalidReason)}
    </div>
    <div className={styles.currentPlayScore}>
      {currentPlayScoreDisplay(score, play)}
    </div>
  </div>
);

export default CurrentPlayInfo;
