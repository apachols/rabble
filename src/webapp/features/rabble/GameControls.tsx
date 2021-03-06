import React, { useState, useEffect } from "react";
import styles from "./GameControls.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, updateRackTiles } from "./rackSlice";
import { canPlayOneMoreTile } from "./boardSlice";

import Modal from "./components/Modal";
import ChooseBlank from "./components/ChooseBlank";
import TileRack from "./components/TileRack";
import GameOver from "./components/GameOver";
import CurrentPlayInfo from "./components/CurrentPlayInfo";

import Board from "./board/Board";
import Buttons from "./Buttons";

import { pullPlayTilesFromRack } from "../../../game/tileBag";
import { getUserInfo } from "../../app/localStorage";

import { addPlayTile, selectPlaySquares } from "./boardSlice";

import useDebounce from "../../hooks/useDebounce";

const GameControls = (props: GameBoardProps) => {
  const {
    playerID,
    ctx: { currentPlayer, gameover },
    G: { players, gameBoard },
    moves: {
      playWord,
      exchangeTiles,
      checkWord,
      cleanUp,
      setNickName,
      reorderRackTiles,
    },
    events: { endTurn },
  } = props;

  // Pull info for the current player
  const { tileRack, currentPlay } = players[playerID];
  const nowPlaying = currentPlayer;
  const currentPlayerHasTurn = nowPlaying === playerID;

  // Let the server know the player's nickname
  const { nickname } = getUserInfo();
  const serverNickname = players[playerID].nickname;
  useEffect(() => {
    if (currentPlayerHasTurn && nickname !== serverNickname) {
      setNickName(nickname);
    }
  }, [nickname, serverNickname, setNickName, currentPlayerHasTurn]);

  const playSquares = useSelector(selectPlaySquares);

  // Update the rack tiles in the local reducer with the rack tiles from the server
  const dispatch = useDispatch();
  const displayTileRack = useSelector(selectTileRack);
  useEffect(() => {
    if (!playSquares.length) {
      dispatch(updateRackTiles(tileRack));
    }
  }, [dispatch, tileRack, playSquares.length]);

  const canAddOneMoreTile = useSelector(canPlayOneMoreTile);

  const [showBlankModal, setShowBlankModal] = useState(false);

  const debouncedPlaySquares = useDebounce(playSquares, 1000);
  useEffect(() => {
    if (debouncedPlaySquares.length > 0 && currentPlayerHasTurn) {
      console.log(
        "HOOK RUNNING",
        "checkWord",
        debouncedPlaySquares.map((sq: Square) => sq?.playTile?.letter)
      );
      checkWord(debouncedPlaySquares);
    }
  }, [checkWord, debouncedPlaySquares, currentPlayerHasTurn]);

  const chooseTileForBlank = (selectedTile: Tile) => {
    // Find a blank tile in the player's rack
    const blankTile = displayTileRack.find((t) => t.blank);
    if (!blankTile) {
      throw new Error("ChooseBlank could not find a blank tile");
    }

    // Remove blank tile from player rack
    const copyRack = [...displayTileRack];
    pullPlayTilesFromRack([blankTile], copyRack);
    dispatch(updateRackTiles(copyRack));

    // Add blank tile to the board with a new selected letter
    dispatch(addPlayTile({ ...blankTile, letter: selectedTile.letter }));

    // Close the modal
    setShowBlankModal(false);
  };

  const tryToPlayTile = (tile: Tile): boolean => {
    if (canAddOneMoreTile) {
      const copyRack = [...displayTileRack];

      if (tile.blank) {
        setShowBlankModal(true);
        return true;
      }

      pullPlayTilesFromRack([tile], copyRack);

      // Put the tiles on the board
      dispatch(addPlayTile(tile));

      // The rack is now everything that hasn't been played
      dispatch(updateRackTiles(copyRack));

      return true;
    }
    return false;
  };

  const reorderTilesOnTileDrop = (positionFrom: number, positionTo: number) => {
    const copyRack = [...displayTileRack];
    const pulled = copyRack.splice(positionFrom, 1);
    copyRack.splice(positionTo, 0, pulled[0]);
    if (currentPlayerHasTurn) {
      reorderRackTiles(copyRack);
    } else {
      dispatch(updateRackTiles(copyRack));
    }
  };

  const onTileDropOnlyIfNoLettersPlayed = {
    onTileDrop: playSquares.length ? undefined : reorderTilesOnTileDrop,
  };

  return (
    <div className={styles.controls}>
      <Board gameBoard={gameBoard} />
      <div>
        <CurrentPlayInfo
          invalidReason={currentPlay.invalidReason}
          score={currentPlay.score}
          play={debouncedPlaySquares}
        />
        <TileRack
          onTileClick={tryToPlayTile}
          tilesInRack={displayTileRack}
          playerTiles={tileRack}
          {...onTileDropOnlyIfNoLettersPlayed}
        />
        <Buttons
          currentPlayerHasTurn={currentPlayerHasTurn}
          playWord={playWord}
          checkWord={checkWord}
          exchangeTiles={exchangeTiles}
          endTurn={endTurn}
          tileRack={tileRack}
          cleanUp={cleanUp}
          reorderRackTiles={reorderRackTiles}
          currentPlay={currentPlay}
        />
      </div>

      {gameover && <GameOver gameover={gameover} />}

      <Modal showModal={showBlankModal}>
        <ChooseBlank selectTile={chooseTileForBlank} />
      </Modal>
    </div>
  );
};

export default GameControls;
