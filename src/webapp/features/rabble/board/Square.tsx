import React from "react";
import styles from "./Square.module.css";
import Tile from "../components/Tile";

import { HORIZONTAL, VERTICAL } from "../../../../game/board";

type SquareProps = {
  direction: Direction;
  square: Square;
  clickSquare: () => void;
  selectedLocation: number | null;
  playableLocations: number[];
};

const Square = ({
  direction,
  square,
  clickSquare,
  selectedLocation,
  playableLocations,
}: SquareProps) => {
  const theTile = square.tile || square.playTile;

  const squareContents = theTile ? (
    <Tile tile={theTile} context={"board"} onClick={() => {}} />
  ) : (
    <div className={styles.displayBonus}>{square.bonus}</div>
  );

  const playableHighlight = ({ location }: Square, direction: Direction) => {
    if (playableLocations.includes(location)) {
      return styles[`playable`];
    }
    return "";
  };

  const applyClasses = [
    styles.squareContainer,
    square.bonus ? styles[square.bonus] : styles.default,
    playableHighlight(square, direction),
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
