import React, { useState, useEffect } from "react";
import styles from "./GameControls.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTileRack, updateRackTiles } from "./rackSlice";
import { canPlayOneMoreTile } from "./boardSlice";

import Modal from "./components/Modal";
import ChooseBlank from "./components/ChooseBlank";
import TileRack from "./components/TileRack";

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
  const currentPlayIsValid = currentPlay.valid;
  const currentPlayTilesLaid = currentPlay.tilesLaid;

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

  const [showModal, setShowModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [needToCheckWord, setNeedToCheckWord] = useState(false);

  const debouncedPlaySquares = useDebounce(playSquares, 1000);
  // OOF, ok I think now there's a state interaction where the updateBoard that comes back from
  // the checkWord is wiping out the callback for debouncedPlaySquares?  Yuck
  useEffect(() => {
    console.log(`needToCheckWord ${needToCheckWord}`);
    if (
      needToCheckWord &&
      debouncedPlaySquares.length > 0 &&
      currentPlayerHasTurn
    ) {
      console.log(
        "HOOK RUNNING",
        "checkWord",
        debouncedPlaySquares.map((sq: Square) => sq?.playTile?.letter)
      );
      checkWord(debouncedPlaySquares);
      setNeedToCheckWord(false);
    }
  }, [
    needToCheckWord,
    setNeedToCheckWord,
    checkWord,
    debouncedPlaySquares,
    currentPlayerHasTurn,
  ]);

  return (
    <div className={styles.controls}>
      <Board gameBoard={gameBoard} />
      <h4>
        <div className={styles.invalidPlayError}>{errorMessage}</div>
        <TileRack
          onTileClick={(tile): boolean => {
            if (canAddOneMoreTile) {
              const copyRack = [...displayTileRack];

              if (tile.blank) {
                setShowModal(true);
                return true;
              }

              pullPlayTilesFromRack([tile], copyRack);

              // Put the tiles on the board
              dispatch(addPlayTile(tile));

              // The rack is now everything that hasn't been played
              dispatch(updateRackTiles(copyRack));

              setErrorMessage("");

              setNeedToCheckWord(true);

              return true;
            }
            return false;
          }}
          tilesInRack={displayTileRack}
          playerTiles={tileRack}
        />
        <Buttons
          currentPlayIsValid={currentPlayIsValid}
          currentPlayerHasTurn={currentPlayerHasTurn}
          exchangeTiles={exchangeTiles}
          playWord={playWord}
          checkWord={checkWord}
          endTurn={endTurn}
          tileRack={tileRack}
          cleanUp={cleanUp}
          reorderRackTiles={reorderRackTiles}
          currentPlayTilesLaid={currentPlayTilesLaid}
          currentPlay={currentPlay}
          setErrorMessage={setErrorMessage}
        />
      </h4>

      {gameover && (
        <h2>
          {gameover?.draw ? (
            "You Tied! Weird!"
          ) : (
            <>
              <div style={{ color: "red", display: "inline-block" }}>
                {gameover?.winner}
              </div>{" "}
              wins!
            </>
          )}
        </h2>
      )}

      <Modal showModal={showModal}>
        <ChooseBlank
          selectTile={(selectedTile: Tile) => {
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
            dispatch(
              addPlayTile({ ...blankTile, letter: selectedTile.letter })
            );

            // Close the modal
            setShowModal(false);
            setNeedToCheckWord(true);
          }}
        />
      </Modal>
    </div>
  );
};

export default GameControls;
