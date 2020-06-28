import React from "react";
import Tile from "./Tile";
import { useDrag, useDrop } from "react-dnd";
import blankDrag from "./blankDrag.png";
import { usePreview } from "react-dnd-preview";

interface DraggableTileProps {
  tile: Tile;
  onClick: (tile: Tile) => void;
  onTileDrop: (dragged: Tile, dropped: Tile) => void;
}

interface DropTargetItem {
  type: string;
  tile: Tile;
}

const TouchDragPreview = () => {
  const isTouch = navigator.maxTouchPoints || navigator.msMaxTouchPoints;
  const { display, style } = usePreview();
  if (!isTouch || !display) {
    return null;
  }
  return (
    <div style={{ ...style }}>
      <img src={blankDrag} alt={"drag"} />
    </div>
  );
};

const DraggableTile = (props: DraggableTileProps) => {
  const { tile, onClick, onTileDrop } = props;
  const [{ isDragging }, drag] = useDrag({
    item: { type: "TILE", tile },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "TILE",
    drop: (item: unknown) => {
      const dropTile = (item as DropTargetItem).tile;
      onTileDrop(tile, dropTile);
    },
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });
  if (!tile) {
    return null;
  }
  return (
    <>
      <div ref={drop}>
        <div ref={drag}>
          <TouchDragPreview />
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

export default DraggableTile;
