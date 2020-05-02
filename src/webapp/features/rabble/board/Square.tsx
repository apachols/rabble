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

  const squareContent = (location: number) => {
    if (location === 0) {
      return <Tile letter="A" value={1} context={"board"} />;
    }
    return null;
  };

  return (
    <div
      className={styles.squareContainer}
      style={{ backgroundColor }}
      key={square.location}
    >
      <div className={styles.sizer}></div>
      <div className={styles.square}>{squareContent(square.location)}</div>
    </div>
  );
};

export default Square;

// {square.location === 0 ? (
// ) : (
//   ""
// )}
