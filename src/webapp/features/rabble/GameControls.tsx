import React, { useEffect, useRef } from "react";
import styles from "./GameControls.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, updateRackTiles, shuffleRack } from "./rackSlice";
import { selectPlayTiles } from "./boardSlice";

import TileRack from "./components/TileRack";

import Board from "./board/Board";
import ButtonsAndInput from "./ButtonsAndInput";

import { pullPlayTilesFromRack } from "../../../game/tileBag";

import { addPlayTile } from "./boardSlice";

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

  const wordToPlayInputRef: React.RefObject<HTMLInputElement> = useRef(null);

  return (
    <div className={styles.controls}>
      <Board gameBoard={gameBoard} wordToPlayInputRef={wordToPlayInputRef} />
      <h4>
        <TileRack
          onTileClick={(tile) => {
            const copyRack = [...displayTileRack];

            pullPlayTilesFromRack([tile], copyRack);

            // Put the tiles on the board
            dispatch(addPlayTile(tile));

            // The rack is now everything that hasn't been played
            dispatch(updateRackTiles(copyRack));

            // setErrorMessage("");
            console.log("clicked", tile);
          }}
          tileRack={displayTileRack}
        />
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
          wordToPlayInputRef={wordToPlayInputRef}
        />
      )}
    </div>
  );
};

export default GameControls;
