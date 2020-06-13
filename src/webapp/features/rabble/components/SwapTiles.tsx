import React, { useState } from "react";
import styles from "./SwapTiles.module.css";
import Tile from "./Tile";
import TileRack from "./TileRack";
import { pullPlayTilesFromRack } from "../../../../game/tileBag";

import { ReactComponent as UndoIcon } from "../svg/arrow-undo-outline.svg";
import { ReactComponent as SwapIcon } from "../svg/swap-horizontal-outline.svg";

type SwapTilesProps = {
  setShowModal: (show: boolean) => void;
  tileRack: Tile[];
  swapSelectedTiles: (tiles: Tile[]) => void;
};

const SwapTiles = ({
  tileRack,
  setShowModal,
  swapSelectedTiles,
}: SwapTilesProps) => {
  const [tilesToSwap, setTilesToSwap] = useState([] as Tile[]);
  const [tilesInRack, setTilesInRack] = useState(tileRack);

  const sendTileToSwap = (tile: Tile) => {
    const copyRack = [...tilesInRack];
    pullPlayTilesFromRack([tile], copyRack);
    setTilesInRack(copyRack);
    setTilesToSwap([...tilesToSwap, tile]);
    return true;
  };

  const cleanup = () => {
    setTilesToSwap([]);
    setTilesInRack(tileRack);
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
    <div className={styles.swapTiles}>
      <div className={styles.topButtons}>
        <button onClick={cancelSwap}>
          <UndoIcon />
          CANCEL
        </button>
        <button disabled={tilesToSwap.length === 0} onClick={swapTiles}>
          <SwapIcon />
          SWAP
        </button>
      </div>
      <div className={styles.swapRack}>
        {tilesToSwap.map((tile, idx) => (
          <div key={idx} className={styles.swapContainer}>
            <Tile
              onClick={(ev) => {
                console.log("swap tile click", idx);
              }}
              tile={tile}
            />
          </div>
        ))}
      </div>
      <TileRack
        onTileClick={sendTileToSwap}
        tilesInRack={tilesInRack}
        playerTiles={tileRack}
      />
    </div>
  );
};

export default SwapTiles;
