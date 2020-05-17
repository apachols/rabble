import React from "react";
import blank from "./blank.png";
import styles from "./Tile.module.css";

type TileProps = {
  tile: Tile;
  context?: string;
  onClick: (tile: Tile) => void;
};

const Tile = (props: TileProps) => {
  const { tile, context, onClick } = props;

  const { letter, value } = tile;

  const textSize =
    context === "board" ? styles.textSizeBoard : styles.textSizeRack;

  const blankStyle = value === 0 ? { color: "red" } : {};

  return (
    <div onClick={() => onClick(tile)} className={styles.tileImageContainer}>
      <img src={blank} className={styles.tileImage} alt={letter} />
      <div className={styles.tileTextContainer}>
        <div className={`${textSize} ${styles.letterText}`} style={blankStyle}>
          {letter.toUpperCase()}
          <sub className={styles.valueSize}>{value ? value : ""}</sub>
        </div>
      </div>
    </div>
  );
};

export default Tile;
