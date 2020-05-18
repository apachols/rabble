import React from "react";
import styles from "./Square.module.css";
import Tile from "../components/Tile";

type SquareProps = {
  direction: Direction;
  square: Square;
  clickSquare: () => void;
  selectedLocation: number | null;
  playableLocations: number[];
};

const Square = ({ square, clickSquare, playableLocations }: SquareProps) => {
  const { location, bonus } = square;
  const theTile = square.tile || square.playTile;

  const squareContents = theTile ? (
    <Tile tile={theTile} context={"board"} onClick={() => {}} />
  ) : (
    <div className={styles.displayBonus}>{square.bonus}</div>
  );

  const applyClasses = [
    styles.squareContainer,
    bonus ? styles[bonus] : styles.default,
    playableLocations.includes(location) ? styles.playable : "",
  ].join(" ");

  return (
    <div
      className={applyClasses}
      key={square.location}
      onClick={(ev) => clickSquare()}
    >
      <div className={styles.sizer}></div>
      <div className={styles.square}>{squareContents}</div>
    </div>
  );
};

export default Square;
