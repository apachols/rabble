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

  useEffect(() => {
    if (playerTiles.length === tilesInRack.length) {
      setClickedTiles([]);
    }
  }, [playerTiles, tilesInRack]);

  const renderTiles = playerTiles.map((t, idx) =>
    clickedTiles.includes(idx) ? null : t
  );

  return (
    <div className={styles.tileRack}>
      {renderTiles.map((tileOrNull, idx) => (
        <div key={idx} className={styles.tileContainer}>
          {tileOrNull ? (
            <Tile
              onClick={(ev) => {
                if (onTileClick(ev)) {
                  setClickedTiles([...clickedTiles, idx]);
                }
              }}
              tile={tileOrNull}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default TileRack;
