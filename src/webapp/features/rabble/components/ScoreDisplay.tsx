import React from "react";
import styles from "./ScoreDisplay.module.css";

type ScoreDisplayProps = {
  scoreList: ScoreList;
};

const ScoreDisplay = (props: ScoreDisplayProps) => {
  const { scoreList } = props;

  const playerScore = ({ nickname, score }: ScoreData) =>
    nickname ? (
      <span key={nickname}>
        <strong>{nickname}</strong>: {score}
      </span>
    ) : null;

  return (
    <div className={styles.scoreListContainer}>
      {Object.keys(scoreList).map((p) => playerScore(scoreList[p]))}
    </div>
  );
};

export default ScoreDisplay;
