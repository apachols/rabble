import React, { useState, useEffect } from "react";
import styles from "./TileRack.module.css";
import Tile from "./Tile";
import { useDrag, useDrop } from "react-dnd";

type TileRackProps = {
  tilesInRack: Tile[];
  playerTiles: Tile[];
  onTileClick: (tile: Tile) => boolean;
};

interface DraggableTileProps {
  tile: Tile | null;
  onClick: (tile: Tile) => void;
}

const DraggableTile = (props: DraggableTileProps) => {
  const { tile, onClick } = props;
  const [{ isDragging }, drag] = useDrag({
    item: { type: "TILE", tile },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "TILE",
    drop: (arg1) => console.log("DROP A TILE", arg1),
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });
  if (!tile) {
    return null;
  }
  if (isDragging) {
    console.log("Dragging a tile!!");
  }
  return (
    <>
      <div
        style={{
          color: isOver ? "red" : "black",
        }}
        ref={drop}
      >
        <div ref={drag}>
          <Tile
            isDropping={isOver}
            isDragging={isDragging}
            onClick={onClick}
            tile={tile}
          />
        </div>
      </div>
    </>
  );
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

  const handleClick = (idx: number) => (tile: Tile) => {
    // if the click put the tile on the board
    if (onTileClick(tile)) {
      // save which position the tile was in, and show a blank space there
      setClickedTiles([...clickedTiles, idx]);
    }
  };

  return (
    <div className={styles.tileRackContainer}>
      <div className={styles.tileRack}>
        {renderTiles.map((tileOrNull, idx) => (
          <div key={idx} className={styles.tileContainer}>
            <DraggableTile tile={tileOrNull} onClick={handleClick(idx)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileRack;
