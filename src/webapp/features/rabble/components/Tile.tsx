import React from "react";
import blank from "./blank.png";
import styles from "./Tile.module.css";

type TileProps = {
  tile: Tile;
  context?: string;
  onClick: (tile: Tile) => void;
  isDragging?: boolean;
  isDropping?: boolean;
};

const Tile = (props: TileProps) => {
  const { tile, context, onClick, isDragging, isDropping } = props;

  const { letter, value } = tile;

  const textSize =
    context === "board" ? styles.textSizeBoard : styles.textSizeRack;

  const tileStyle = {
    color: "black",
    opacity: "100%",
  };

  if (value === 0) {
    tileStyle.color = "red";
  }

  if (isDragging) {
    tileStyle.opacity = "50%";
  }

  if (isDropping) {
    tileStyle.color = "var(--bg)";
    tileStyle.opacity = "50%";
  }

  const imageStyle = isDropping ? { filter: "brightness(90%)" } : {};

  return (
    <div onClick={() => onClick(tile)} className={styles.tileImageContainer}>
      <img
        src={blank}
        className={styles.tileImage}
        alt={letter}
        style={imageStyle}
      />
      <div className={styles.tileTextContainer}>
        <div className={`${textSize} ${styles.letterText}`} style={tileStyle}>
          {letter.toUpperCase()}
          <sub className={styles.valueSize}>{value ? value : ""}</sub>
        </div>
      </div>
    </div>
  );
};

export default Tile;
