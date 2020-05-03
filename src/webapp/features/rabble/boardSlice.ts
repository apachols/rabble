import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState /* , AppThunk */ } from "../../app/store";

import {
  HORIZONTAL,
  VERTICAL,
  getNextLocation,
  layTiles,
} from "../../../game/board";

interface BoardState {
  squares: Square[];
  selectedLocation: number | null;
  currentPlay: Tile[];
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
      state.currentPlay = [...tiles];
    },
    changeSquareSelection: (state, action: PayloadAction<number>) => {
      const { squares, selectedLocation, currentPlay } = state;
      const newSelectedLocation = action.payload;
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
  if (selectedLocation === null) {
    return false;
  }

  const selectedSquare = squares[selectedLocation];

  let currentSquare = selectedSquare;
  return currentPlay.every((pt) => {
    if (currentSquare.tile) {
      return false;
    }
    const nextLocation = getNextLocation(currentSquare.location, direction);
    if (!nextLocation) {
      // we have fallen off the edge of the board
      return false;
    }
    currentSquare = squares[nextLocation];
    if (currentSquare.tile) {
      return false;
    }
    return true;
  });
};

export const selectPlaySquares = (state: RootState) =>
  state.board.squares.filter((s) => s.playTile);

export const selectSelectedLocation = (state: RootState) =>
  state.board.selectedLocation;

export const selectDirection = (state: RootState) => state.board.direction;

export const selectSquares = (state: RootState) => state.board.squares;

export const selectPlayTiles = (state: RootState) => state.board.currentPlay;

export default slice.reducer;
