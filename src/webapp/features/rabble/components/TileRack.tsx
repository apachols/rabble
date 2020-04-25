import React from "react";
import styles from "./TileRack.module.css";
import Tile from "./Tile";

type TileRackProps = {
  tileRack: Tile[];
};

const TileRack = (props: TileRackProps) => {
  const { tileRack } = props;

  return (
    <div className={styles.tileRack}>
      {tileRack.map((t, idx) => (
        <div className={styles.tileContainer}>
          <Tile key={idx} letter={t.letter} value={t.value} />
        </div>
      ))}
    </div>
  );
};

export default TileRack;
