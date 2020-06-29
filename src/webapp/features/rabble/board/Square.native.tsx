import React from "react";
// import styles from "./Square.module.css";
import Tile from "../components/Tile.native";
import { getDistance } from '../../../../game/board';
import { StyleSheet, View, StyleProp } from 'react-native';
import { Icon, Button } from 'react-native-elements';

type SquareProps = {
  direction: Direction;
  square: Square;
  clickSquare: () => void;
  selectedLocation: number | null;
  playableLocations: number[];
};

const styleStringToStyle = (bonus: string | null) : object => {
  console.log('ssts called with:', bonus);
  let base = {};
  switch(bonus) {
    case 'L2':
      base = styles.L2;
      break;
    case 'L3':
      base = styles.L3;
      break;
    case 'W2':
      base = styles.W2;
      break;
    case 'W3':
      base = styles.W3;
      break;
    default:
      base = styles.default;
  }
  return Object.assign({}, base, styles.button);
}

const Square = ({ square, clickSquare, playableLocations, selectedLocation, direction }: SquareProps) => {
  const { location, bonus } = square;
  const theTile = square.tile || square.playTile;
  console.log(location, bonus);
  const squareContents = theTile ? (
    <Button title="TILE" />
    // <Tile tile={theTile} context={"board"} onClick={() => { }} />
  ) : (
      <Button 
        buttonStyle={styleStringToStyle(bonus)} 
        containerStyle={styles.container}
        titleStyle={styles.title}
        title={bonus || ''} />
      // <div className={styles.buttonStyle}>{square.bonus}</div>
    );

  let playableClass = "";
  if (selectedLocation !== null && playableLocations.includes(location)) {

    const dist = getDistance(selectedLocation, square.location, direction) || 0;
    switch (dist) {
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
    <View
      // containerStyle={styles.squareContainer}
    >
      {squareContents}
    </View>
    // <div
    //   className={applyClasses}
    //   key={square.location}
    //   onClick={(ev) => clickSquare()}
    // >
    //   <div className={styles.sizer}></div>
    //   <div className={styles.square}>{squareContents}</div>
    // </div>
  );
};

const styles = StyleSheet.create({
  squareContainer: {
    // display: 'inline-block',
    position: 'relative',
    width: '12%',
    aspectRatio: 1,
    
    // border: '1px solid white', // @TODO
    color: 'rgb(224, 224, 224)',
    borderRadius: 2,
    fontFamily: "'Lato', sans-serif",
  },
  default: {
    backgroundColor: '#C9C6C166'
  },
  L2: {
    backgroundColor: '#6F6CAF'
  },
  L3: {
    backgroundColor: '#474671'
  },
  W2: {
    backgroundColor: '#DA799D'
  },
  W3: {
    backgroundColor: '#8D4E65'
  },
  playable: {
    backgroundColor: '#FF957F',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8D4E65'
  },
  playableLight: {
    backgroundColor: '#FF957F44',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8D4E65'
  },
  playableLighter: {
    backgroundColor: '#FF957F22',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8D4E65'
  },
  container: {
    margin: 1,
  },
  title: {
    fontSize: 8,
    width: '200%',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  button: {
    width: 22,
    height: 22,
  },
  square: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sizer: {
    marginTop: '100%'
  },
  textSizeBoard: {
    fontSize: 12,
  },
  textSizeRack: {
    fontSize: 12
  }
});

export default Square;
