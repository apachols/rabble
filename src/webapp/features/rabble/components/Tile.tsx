import React from "react";
import blank from "./blank.png";
import styles from "./Tile.module.css";

type TileProps = {
  letter: string;
  value: number;
  context?: string;
};

const Tile = (props: TileProps) => {
  const { letter, value, context } = props;

  const textSize =
    context === "board" ? styles.textSizeBoard : styles.textSizeRack;

  const blankStyle = value === 0 ? { color: "red" } : {};
  return (
    <div className={styles.tileImageContainer}>
      <img src={blank} className={styles.tileImage} alt={letter} />
      <div className={`${textSize} ${styles.letterText}`} style={blankStyle}>
        {letter.toUpperCase()}
        <sub className={styles.valueSize}>{value ? value : ""}</sub>
      </div>
    </div>
  );
};

export default Tile;
