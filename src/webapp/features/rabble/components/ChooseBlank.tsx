import React from "react";
import styles from "./ChooseBlank.module.css";
import Tile from "./Tile";
import { alphabetTiles } from "../../../../game/tileBag";

type ChooseBlankProps = {
  selectTile: (t: Tile) => void;
};

const ChooseBlank = ({ selectTile }: ChooseBlankProps) => {
  return (
    <div className={styles.chooseBlankModal}>
      <div className={styles.chooseBlankHeader}>
        <strong>Choose Any Letter</strong>
      </div>
      <div className={styles.tilesContainer}>
        {alphabetTiles.map((t, idx) => (
          <div
            key={idx}
            className={styles.tileWrapper}
            onClick={(ev) => selectTile(t)}
          >
            <Tile onClick={() => {}} tile={t} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseBlank;
