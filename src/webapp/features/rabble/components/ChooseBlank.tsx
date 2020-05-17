import React from "react";
import styles from "./ChooseBlank.module.css";
import Tile from "./Tile";
import { alphabetTiles } from "../../../../game/tileBag";

type ChooseBlankProps = {
  selectTile: (t: Tile) => void;
};

const ChooseBlank = ({ selectTile }: ChooseBlankProps) => {
  return (
    <div className={styles.chooseBlank}>
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
  );
};

export default ChooseBlank;
