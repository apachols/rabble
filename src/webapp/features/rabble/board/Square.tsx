import React from "react";
import styles from "./Square.module.css";
import Tile from "../components/Tile";
import {getDistance} from '../../../../game/board';

type SquareProps = {
  direction: Direction;
  square: Square;
  clickSquare: () => void;
  selectedLocation: number | null;
  playableLocations: number[];
};

const Square = ({ square, clickSquare, playableLocations, selectedLocation, direction }: SquareProps) => {
  const { location, bonus } = square;
  const theTile = square.tile || square.playTile;

  const squareContents = theTile ? (
    <Tile tile={theTile} context={"board"} onClick={() => {}} />
  ) : (
    <div className={styles.displayBonus}>{square.bonus}</div>
  );

  let playableClass = "";
  if (selectedLocation !== null && playableLocations.includes(location)) {
    
    const dist = getDistance(selectedLocation, square.location, direction) || 0;
    switch(dist) {
      case 0:
        playableClass = styles.playable;
        break;
      case 1:
        playableClass = styles.playableLight;
        break;
      default:
          playableClass = styles.playableLighter;
        break;
    }
  }

  const applyClasses = [
    styles.squareContainer,
    bonus ? styles[bonus] : styles.default,
    playableClass,
    // playableLocations.includes(location) ? styles.playable : "",
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
