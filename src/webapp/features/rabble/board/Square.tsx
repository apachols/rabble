import React from "react";
import styles from "./Square.module.css";
import Tile from "../components/Tile";

import { HORIZONTAL, VERTICAL } from "../../../../game/board";

type SquareProps = {
  direction: Direction;
  square: Square;
  clickSquare: () => void;
  selectedLocation: number | null;
};

const Square = ({
  direction,
  square,
  clickSquare,
  selectedLocation,
}: SquareProps) => {
  const theTile = square.tile || square.playTile;

  const squareTypeClassName = ({ bonus, location }: Square) => {
    if (selectedLocation === location) {
      if (direction === HORIZONTAL) {
        return styles.selectedHorizontal;
      }
      if (direction === VERTICAL) {
        return styles.selectedVertical;
      }
    }
    return bonus ? styles[bonus] : styles.default;
  };

  const squareContents = theTile ? (
    <Tile tile={theTile} context={"board"} onClick={() => {}} />
  ) : (
    <div className={styles.displayBonus}>
      {selectedLocation !== square.location ? square.bonus : null}
    </div>
  );

  return (
    <div
      className={`${styles.squareContainer} ${squareTypeClassName(square)}`}
      key={square.location}
      onClick={(ev) => clickSquare()}
    >
      <div className={styles.sizer}></div>
      <div className={styles.square}>{squareContents}</div>
    </div>
  );
};

export default Square;