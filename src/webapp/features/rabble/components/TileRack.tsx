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
      {tileRack.map((t) => (
        <Tile letter={t.letter} value={t.value} />
      ))}
    </div>
  );
};

export default TileRack;
