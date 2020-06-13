import React, { useState, useEffect } from "react";
import styles from "./SwapTiles.module.css";
import Tile from "./Tile";
import TileRack from "./TileRack";
import { pullPlayTilesFromRack } from "../../../../game/tileBag";

import { ReactComponent as UndoIcon } from "../svg/arrow-undo-outline.svg";
import { ReactComponent as SwapIcon } from "../svg/swap-horizontal-outline.svg";

type SwapTilesProps = {
  showModal: boolean;
  playerTiles: Tile[];
  setShowModal: (show: boolean) => void;
  swapSelectedTiles: (tiles: Tile[]) => void;
};

const SwapTiles = ({
  showModal,
  playerTiles,
  setShowModal,
  swapSelectedTiles,
}: SwapTilesProps) => {
  const [tilesToSwap, setTilesToSwap] = useState([] as Tile[]);
  const [tilesInRack, setTilesInRack] = useState(playerTiles);

  // the modal stays rendered when it's not shown
  // reset the rack tiles when showModal changes to prevent a stale rack
  useEffect(() => {
    if (showModal) {
      setTilesInRack(playerTiles);
    }
  }, [showModal, playerTiles]);

  const sendTileToSwap = (tile: Tile) => {
    const copyRack = [...tilesInRack];
    try {
      pullPlayTilesFromRack([tile], copyRack);
    } catch (err) {
      console.log(err.message);
      debugger;
    }
    setTilesInRack(copyRack);
    setTilesToSwap([...tilesToSwap, tile]);
    return true;
  };

  const cleanup = () => {
    setTilesToSwap([]);
    setTilesInRack(playerTiles);
  };

  const cancelSwap = () => {
    cleanup();
    setShowModal(false);
  };

  const swapTiles = () => {
    swapSelectedTiles(tilesToSwap);
    cleanup();
    setShowModal(false);
  };

  return (
    <div className={styles.swapTilesModal}>
      <div className={styles.swapTilesHeader}>
        <strong>Swap some letters?</strong>
      </div>
      <div className={styles.topRow}>
        <button onClick={cancelSwap}>
          <UndoIcon /> NOPE
        </button>
        <div className={styles.swapRack}>
          {tilesToSwap.map((tile, idx) => (
            <div key={idx} className={styles.swapTileContainer}>
              <Tile
                onClick={(ev) => {
                  console.log("swap tile click", idx);
                }}
                tile={tile}
                context="board"
              />
            </div>
          ))}
        </div>
        <button disabled={tilesToSwap.length === 0} onClick={swapTiles}>
          <SwapIcon /> SWAP
        </button>
      </div>
      <div className={styles.rackContainer}>
        <TileRack
          onTileClick={sendTileToSwap}
          tilesInRack={tilesInRack}
          playerTiles={playerTiles}
        />
      </div>
    </div>
  );
};

export default SwapTiles;
