import React, { useState, useEffect } from "react";
import styles from "./TileRack.module.css";
import DraggableTile from "./DraggableTile";
import Tile from "./Tile";

type TileRackProps = {
  tilesInRack: Tile[];
  playerTiles: Tile[];
  onTileClick: (tile: Tile) => boolean;
  onTileDrop?: (positionFrom: number, positionTo: number) => void;
};

const TileRack = ({
  tilesInRack,
  playerTiles,
  onTileClick,
  onTileDrop,
}: TileRackProps) => {
  const [clickedTiles, setClickedTiles] = useState([] as number[]);
  // If the player put their tiles back, clear the clicked tiles
  useEffect(() => {
    if (playerTiles.length === tilesInRack.length) {
      setClickedTiles([]);
    }
  }, [playerTiles, tilesInRack]);

  const tilesToRender =
    playerTiles.length === tilesInRack.length
      ? // show the rack tiles if no tiles have been played (allows reordering during opponent's turn)
        tilesInRack
      : // Insert blank spaces in the rack for already clicked tiles
        playerTiles.map((t, idx) => (clickedTiles.includes(idx) ? null : t));

  const handleClick = (idx: number) => (tile: Tile) => {
    // if the click put the tile on the board
    if (onTileClick(tile)) {
      // save which position the tile was in, and show a blank space there
      setClickedTiles([...clickedTiles, idx]);
    }
  };

  const renderTile = (tile: Tile, position: number) => {
    if (!onTileDrop) {
      return <Tile tile={tile} onClick={handleClick(position)} />;
    }
    return (
      <DraggableTile
        tile={tile}
        tileRackPosition={position}
        onClick={handleClick(position)}
        onTileDrop={onTileDrop}
      />
    );
  };

  return (
    <div className={styles.tileRackContainer}>
      <div className={styles.tileRack}>
        {tilesToRender.map((tileOrNull, idx) => (
          <div key={idx} className={styles.tileContainer}>
            {tileOrNull && renderTile(tileOrNull, idx)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileRack;
