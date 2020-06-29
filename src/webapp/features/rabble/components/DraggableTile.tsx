import React from "react";
import Tile from "./Tile";
import { useDrag, useDrop } from "react-dnd";
import blankDrag from "./blankDrag.png";
import { usePreview } from "react-dnd-preview";

interface DraggableTileProps {
  tile: Tile;
  tileRackPosition: number;
  onClick: (tile: Tile) => void;
  onTileDrop: (positionFrom: number, positionTo: number) => void;
}

interface DraggedItem {
  type: string;
  position: number;
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
  const { tile, onClick, onTileDrop, tileRackPosition } = props;
  const [{ isDragging }, drag] = useDrag({
    item: { type: "TILE", position: tileRackPosition },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "TILE",
    drop: (item: unknown) => {
      if (onTileDrop) {
        const draggedTilePosition = (item as DraggedItem).position;
        onTileDrop(draggedTilePosition, tileRackPosition);
      }
    },
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });
  return (
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
  );
};

export default DraggableTile;
