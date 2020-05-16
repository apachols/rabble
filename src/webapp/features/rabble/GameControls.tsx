import React, { useEffect } from "react";
import styles from "./GameControls.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, updateRackTiles } from "./rackSlice";
import { selectPlayTiles } from "./boardSlice";

import TileRack from "./components/TileRack";

import Board from "./board/Board";
import ButtonsAndInput from "./ButtonsAndInput";

const GameControls = (props: GameBoardProps) => {
  const {
    playerID,
    ctx: { currentPlayer, gameover },
    G: { players, gameBoard },
    moves: { playWord, exchangeTiles, checkWord, cleanUp },
    events: { endTurn },
  } = props;

  // Pull info for the current player
  const { tileRack, currentPlay } = players[playerID];
  const nowPlaying = currentPlayer;
  const currentPlayerHasTurn = nowPlaying === playerID;
  const currentPlayIsValid = currentPlay.valid;
  const currentPlayTilesLaid = currentPlay.tilesLaid;

  // Update the rack tiles in the local reducer with the rack tiles from the server
  const dispatch = useDispatch();
  const displayTileRack = useSelector(selectTileRack);
  useEffect(() => {
    dispatch(updateRackTiles(tileRack));
  }, [dispatch, tileRack]);

  // These are tiles with which the player is trying to make a word
  const playTiles = useSelector(selectPlayTiles);

  const gameOverScreen = (
    <h2>
      {gameover?.draw ? "You Tied! Weird!" : `Player ${gameover?.winner} Wins!`}
    </h2>
  );

  return (
    <div className={styles.controls}>
      <Board
        gameBoard={gameBoard}
        // wordToPlayInputRef={wordToPlayInputRef}
      />
      <h4>
        <TileRack tileRack={playTiles} />
      </h4>

      {gameover ? (
        gameOverScreen
      ) : (
        <ButtonsAndInput
          currentPlayIsValid={currentPlayIsValid}
          currentPlayerHasTurn={currentPlayerHasTurn}
          exchangeTiles={exchangeTiles}
          playWord={playWord}
          checkWord={checkWord}
          endTurn={endTurn}
          tileRack={tileRack}
          playTiles={playTiles}
          cleanUp={cleanUp}
          currentPlayTilesLaid={currentPlayTilesLaid}
          currentPlay={currentPlay}
        />
      )}

      <h4>
        <TileRack tileRack={displayTileRack} />
      </h4>
    </div>
  );
};

export default GameControls;
