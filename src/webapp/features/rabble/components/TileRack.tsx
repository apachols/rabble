import React from "react";
import styles from "./TileRack.module.css";
import Tile from "./Tile";

type TileRackProps = {
  tileRack: Tile[];
  onTileClick: (tile: Tile) => void;
};

const TileRack = ({ tileRack, onTileClick }: TileRackProps) => {
  return (
    <div className={styles.tileRack}>
      {tileRack.map((t, idx) => (
        <div key={idx} className={styles.tileContainer}>
          <Tile onClick={onTileClick} tile={t} />
        </div>
      ))}
    </div>
  );
};

export default TileRack;
