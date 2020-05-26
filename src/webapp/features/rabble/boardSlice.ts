import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { HORIZONTAL, VERTICAL, getNextLocation } from "../../../game/board";

interface BoardState {
  squares: Square[];
  selectedLocation: number | null;
  playableLocations: number[];
  currentPlay: Square[];
  direction: Direction;
}

const initialState: BoardState = {
  selectedLocation: null,
  squares: [],
  playableLocations: [],
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

const getPlayableLocations = (
  location: number,
  direction: Direction,
  squares: Square[]
) => {
  // TODO - This implementation assumes player's rack has 7 tiles
  const playableLocations = [location];
  let nextLocation: number | null = location;
  for (let ii = 0; ii < 6; ii++) {
    if (nextLocation !== null) {
      nextLocation = getNextLocation(nextLocation, direction);
    }
    // This needs to be a getNextEmptySquare function
    while (nextLocation !== null && squares[nextLocation].tile) {
      nextLocation = getNextLocation(nextLocation, direction);
    }
    if (nextLocation !== null) {
      playableLocations.push(nextLocation);
    }
  }

  return playableLocations;
};

export const slice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateBoard: (state, action: PayloadAction<Square[]>) => {
      state.squares = [...action.payload];
    },
    addPlayTile: (state, action: PayloadAction<Tile>) => {
      const tile = action.payload;
      const { squares, selectedLocation, currentPlay, direction } = state;

      // If no played letters, begin at selectedLocation
      // Otherwise begin at next location from end of currentPlay
      let playAtLocation =
        currentPlay.length === 0
          ? selectedLocation
          : getNextLocation(
              currentPlay[currentPlay.length - 1].location,
              direction
            );

      // If we run into tiles from previous turns, skip them until we find a playable location
      while (playAtLocation !== null && squares[playAtLocation].tile) {
        playAtLocation = getNextLocation(playAtLocation, direction);
      }

      // If we have run off the edge of the board, we cannot add another tile, return...
      if (playAtLocation === null) return;

      squares[playAtLocation].playTile = tile;

      state.currentPlay = squares.filter((s) => s.playTile);
    },
    clearPlayTiles: (state, action: PayloadAction<void>) => {
      state.currentPlay = [];
      state.squares.forEach((sq) => {
        sq.playTile = null;
      });
    },
    changeSquareSelection: (state, action: PayloadAction<number | null>) => {
      const { squares, selectedLocation, currentPlay } = state;
      const newSelectedLocation = action.payload;

      if (newSelectedLocation === null) {
        state.selectedLocation = null;
        state.direction = null;
        state.playableLocations = [];

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
        state.playableLocations = getPlayableLocations(
          newSelectedLocation,
          state.direction,
          squares
        );
        return;
      }

      const currentValue = state.direction;
      if (newSelectedLocation === selectedLocation) {
        // Change the value of the current selected square
        state.direction = getNextDirection(currentValue);
        if (!state.direction) {
          state.selectedLocation = null;
          state.playableLocations = [];
        } else {
          state.playableLocations = getPlayableLocations(
            newSelectedLocation,
            state.direction,
            squares
          );
        }
        return;
      }

      // Unselect the current square and select a new square
      state.direction = getNextDirection(null);
      state.selectedLocation = newSelectedLocation;
      state.playableLocations = getPlayableLocations(
        newSelectedLocation,
        state.direction,
        squares
      );
    },
  },
});

export const {
  updateBoard,
  changeSquareSelection,
  addPlayTile,
  clearPlayTiles,
} = slice.actions;

export const canPlayOneMoreTile = (state: RootState) => {
  const { squares, selectedLocation, currentPlay, direction } = state.board;

  if (selectedLocation === null) {
    return false;
  }

  // If there's no tile on the selectedLocation, start your play
  if (currentPlay.length === 0) {
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

export const selectPlayableLocations = (state: RootState) =>
  state.board.playableLocations;

export default slice.reducer;
