import React, { useState, useEffect } from "react";
import styles from "./TileRack.module.css";
import Tile from "./Tile";

type TileRackProps = {
  tilesInRack: Tile[];
  playerTiles: Tile[];
  onTileClick: (tile: Tile) => boolean;
};

const TileRack = ({ tilesInRack, playerTiles, onTileClick }: TileRackProps) => {
  const [clickedTiles, setClickedTiles] = useState([] as number[]);
  // If the player put their tiles back, clear the clicked tiles
  useEffect(() => {
    if (playerTiles.length === tilesInRack.length) {
      setClickedTiles([]);
    }
  }, [playerTiles, tilesInRack]);

  // Insert blank spaces in the rack for already clicked tiles
  const renderTiles = playerTiles.map((t, idx) =>
    clickedTiles.includes(idx) ? null : t
  );

  return (
    <div className={styles.tileRackContainer}>
      <div className={styles.tileRack}>
        {renderTiles.map((tileOrNull, idx) => (
          <div key={idx} className={styles.tileContainer}>
            {tileOrNull ? (
              <Tile
                onClick={(ev) => {
                  // if the click put the tile on the board
                  if (onTileClick(ev)) {
                    // save which position the tile was in, and show a blank space there
                    setClickedTiles([...clickedTiles, idx]);
                  }
                }}
                tile={tileOrNull}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileRack;
