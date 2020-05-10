import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import {
  HORIZONTAL,
  VERTICAL,
  getNextLocation,
  layTiles,
  playTilesFromSquares,
} from "../../../game/board";

interface BoardState {
  squares: Square[];
  selectedLocation: number | null;
  currentPlay: Square[];
  direction: Direction;
}

const initialState: BoardState = {
  selectedLocation: null,
  squares: [],
  currentPlay: [],
  direction: null,
};

const getNextDirection = (current: Direction): Direction => {
  switch (current) {
    case HORIZONTAL:
      return VERTICAL;
    case VERTICAL:
      return null;
  }
  return HORIZONTAL;
};

export const slice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateBoard: (state, action: PayloadAction<Square[]>) => {
      state.squares = [...action.payload];
    },
    updatePlayTiles: (state, action: PayloadAction<Tile[]>) => {
      const tiles = action.payload;
      const { squares, selectedLocation, direction } = state;
      if (selectedLocation === null) {
        return;
      }

      layTiles({
        board: squares,
        direction,
        toPlay: tiles,
        location: selectedLocation,
        callback: layTiles,
      });

      // Zero length play means clear the play off the board
      if (tiles.length === 0) {
        squares.forEach((sq) => {
          sq.playTile = null;
        });
      }
      state.currentPlay = squares.filter((s) => s.playTile);
    },
    changeSquareSelection: (state, action: PayloadAction<number | null>) => {
      const { squares, selectedLocation, currentPlay } = state;
      const newSelectedLocation = action.payload;

      if (newSelectedLocation === null) {
        state.selectedLocation = newSelectedLocation;
        state.direction = null;
        return;
      }

      const newSelectedSquare = squares[newSelectedLocation];

      if (newSelectedSquare.tile || newSelectedSquare.playTile) {
        // cannot select a square with a tile
        return;
      }

      if (currentPlay.length > 0) {
        // cannot change selection while a play is on the board
        return;
      }

      if (selectedLocation === null) {
        // nothing selected, select something
        state.selectedLocation = newSelectedLocation;
        state.direction = getNextDirection(null);
        return;
      }

      const currentValue = state.direction;
      if (newSelectedLocation === selectedLocation) {
        // Change the value of the current selected square
        state.direction = getNextDirection(currentValue);
        if (!state.direction) {
          state.selectedLocation = null;
        }
        return;
      }

      // Unselect the current square and select a new square
      state.direction = getNextDirection(null);
      state.selectedLocation = newSelectedLocation;
    },
  },
});

export const {
  updateBoard,
  changeSquareSelection,
  updatePlayTiles,
} = slice.actions;

export const canPlayOneMoreTile = (state: RootState) => {
  const { squares, selectedLocation, currentPlay, direction } = state.board;

  if (!selectedLocation) {
    return false;
  }

  // If there's no tile on the selectedLocation, start your play
  if (selectedLocation && currentPlay.length === 0) {
    return !squares[selectedLocation].tile;
  }

  // Spin through however many consecutive tiles to lay one on the other side
  const lastSquare = currentPlay[currentPlay.length - 1];
  let nextLocation = getNextLocation(lastSquare.location, direction);
  while (nextLocation !== null && squares[nextLocation].tile) {
    nextLocation = getNextLocation(nextLocation, direction);
  }

  // If we have found the edge of the board, no more tiles
  return nextLocation !== null;
};

export const selectPlaySquares = (state: RootState) =>
  state.board.squares.filter((s) => s.playTile);

export const selectSelectedLocation = (state: RootState) =>
  state.board.selectedLocation;

export const selectDirection = (state: RootState) => state.board.direction;

export const selectSquares = (state: RootState) => state.board.squares;

export const selectPlayTiles = (state: RootState) =>
  playTilesFromSquares(state.board.currentPlay);

export default slice.reducer;
