import React from "react";
// import blank from "./blank.png";
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

type TileProps = {
  tile: Tile;
  context?: string;
  onClick: (tile: Tile) => void;
};

const Tile = (props: TileProps) => {
  const { tile, context, onClick } = props;

  const { letter, value } = tile;

  const textSize =
    context === "board" ? styles.textSizeBoard : styles.textSizeRack;

  const blankStyle = value === 0 ? { color: "red" } : {};

  return (
    <Button
      containerStyle={styles.container}
      titleStyle={textSize}
      title={letter.toUpperCase()} 
      onPress={() => onClick(tile)}
    />
    // <div onClick={() => onClick(tile)} className={styles.tileImageContainer}>
    //   <img src={blank} className={styles.tileImage} alt={letter} />
    //   <div className={styles.tileTextContainer}>
    //     <div className={`${textSize} ${styles.letterText}`} style={blankStyle}>
    //       {letter.toUpperCase()}
    //       <sub className={styles.valueSize}>{value ? value : ""}</sub>
    //     </div>
    //   </div>
    // </div>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100
  },
  textSizeBoard: {
    fontSize: 12,
  },
  textSizeRack: {
    fontSize: 12
  }
});

export default Tile;
