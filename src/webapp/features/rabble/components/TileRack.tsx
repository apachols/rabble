import React from "react";
import styles from "./TileRack.module.css";
import Tile from "./Tile";

type TileRackProps = {
  tileRack: Tile[];
  onClick: () => void;
};

const TileRack = ({ tileRack, onClick }: TileRackProps) => {
  return (
    <div onClick={() => onClick()} className={styles.tileRack}>
      {tileRack.map((t, idx) => (
        <div key={idx} className={styles.tileContainer}>
          <Tile letter={t.letter} value={t.value} />
        </div>
      ))}
    </div>
  );
};

export default TileRack;
