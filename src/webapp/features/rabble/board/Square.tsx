import React from "react";
import styles from "./Square.module.css";
import Tile from "../components/Tile";

type SquareProps = {
  square: Square;
  clickSquare: () => void;
};

const Square = ({ square, clickSquare }: SquareProps) => {
  const theTile = square.tile || square.playTile;

  const squareType = ({ selection, bonus }: Square) => {
    if (selection === "H") {
      return styles.selectedHorizontal;
    }
    if (selection === "V") {
      return styles.selectedVertical;
    }
    return bonus ? styles[bonus] : styles.default;
  };

  return (
    <div
      className={`${styles.squareContainer} ${squareType(square)}`}
      key={square.location}
      onClick={(ev) => clickSquare()}
    >
      <div className={styles.sizer}></div>
      <div className={styles.square}>
        {theTile ? (
          <Tile
            letter={theTile.letter}
            value={theTile.value}
            context={"board"}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Square;
