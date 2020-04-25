import React from "react";
import styles from "./Square.module.css";
import Tile from "../components/Tile";

type SquareProps = {
  square: Square;
};

type SquareColors = {
  [key: string]: string;
};

const SQUARE_COLORS: SquareColors = {
  W2: "red",
  W3: "orange",
  L3: "green",
  L2: "blue",
};

const Square = ({ square }: SquareProps) => {
  const backgroundColor = square.bonus ? SQUARE_COLORS[square.bonus] : "white";
  const noTile = square.location === 0 ? "" : styles.noTile;
  return (
    <div
      className={`${styles.square} ${noTile}`}
      style={{ backgroundColor }}
      key={square.location}
    >
      {square.location === 0 ? (
        <div className={styles.tileContainer}>
          <Tile letter="A" value={1} context={"board"} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Square;
