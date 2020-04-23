import React from "react";
import blank from "./blank.png";
import styles from "./Tile.module.css";

type TileProps = {
  letter: string;
  value: number;
};

const Tile = (props: TileProps) => {
  const { letter, value } = props;
  const blankStyle = value === 0 ? { color: "red" } : {};
  return (
    <div className={styles.tileImageContainer}>
      <img src={blank} className={styles.tileImage} alt={letter} />
      <div className={styles.letterText} style={blankStyle}>
        {letter.toUpperCase()}
      </div>
      <div className={styles.valueText}>{value ? value : ""}</div>
    </div>
  );
};

export default Tile;
