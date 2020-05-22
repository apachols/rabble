import React from "react";
import styles from "./ScoreList.module.css";

type ScoreListProps = {
  scoreList: ScoreList;
};

const ScoreList = (props: ScoreListProps) => {
  const { scoreList } = props;

  const playerScore = ({ nickname, score }: ScoreData) =>
    nickname ? (
      <span>
        <strong>{nickname}</strong>: {score}
      </span>
    ) : null;

  return (
    <div className={styles.scoreListContainer}>
      {Object.keys(scoreList).map((p) => playerScore(scoreList[p]))}
    </div>
  );
};

export default ScoreList;
