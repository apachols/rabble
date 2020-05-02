import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState /* , AppThunk */ } from "../../app/store";
import { generateBoard } from "../../../game/board";

import { HORIZONTAL, VERTICAL } from "../../../game/board";

interface BoardState {
  squares: Square[];
  selected: number | null;
  currentPlay: Tile[];
}

const boardConfig = generateBoard();

const initialState: BoardState = {
  selected: null,
  squares: boardConfig,
  currentPlay: [],
};

const getNextSelection = (current: string | null): string | null => {
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
    updatePlayTiles: (state, action: PayloadAction<Tile[]>) => {
      const tiles = action.payload;
      const { squares, selected } = state;
      if (selected === null) {
        return;
      }

      const layTiles = (
        direction: string,
        toPlay: Tile[],
        location: number | null
      ) => {
        if (!location) {
          return;
        }
        if (toPlay.length === 0) {
          return;
        }
        if (squares[location].tile) {
          return;
        }
        squares[location].playTile = toPlay[0];
        // TODO this is because of typescript -_-
        const hOrV = direction === VERTICAL ? VERTICAL : HORIZONTAL;
        const nextLocation = squares[location].next[hOrV];
        layTiles(direction, toPlay.slice(1), nextLocation);
      };

      const selectedSquare = squares[selected];

      const direction =
        selectedSquare.selection === VERTICAL ? VERTICAL : HORIZONTAL;

      layTiles(direction, tiles, selected);

      // Zero length play means clear the play off the board
      if (tiles.length === 0) {
        squares.forEach((sq) => {
          sq.playTile = null;
        });
      }
      state.currentPlay = [...tiles];
    },
    changeSquareSelection: (state, action: PayloadAction<number>) => {
      const newSelectedLocation = action.payload;
      const newSelectedSquare = state.squares[newSelectedLocation];
      if (newSelectedSquare.tile || newSelectedSquare.playTile) {
        // cannot select a square with a tile
        return;
      }

      if (state.selected === null) {
        // nothing selected, select something
        state.selected = newSelectedLocation;
        newSelectedSquare.selection = getNextSelection(null);
        return;
      }

      const currentSelectedSquare = state.squares[state.selected];
      const currentValue = currentSelectedSquare.selection;
      if (newSelectedLocation === state.selected) {
        // Change the value of the current selected square
        currentSelectedSquare.selection = getNextSelection(currentValue);
        if (!currentSelectedSquare.selection) {
          state.selected = null;
        }
        return;
      }

      // Unselect the current square and select a new square
      currentSelectedSquare.selection = null;
      newSelectedSquare.selection = getNextSelection(null);
      state.selected = newSelectedLocation;
    },
  },
});

export const { changeSquareSelection, updatePlayTiles } = slice.actions;

export const canPlayOneMoreTile = (state: RootState) => {
  const { squares, selected, currentPlay } = state.board;
  if (selected === null) {
    return false;
  }

  const selectedSquare = squares[selected];
  if (!selectedSquare.selection) {
    throw new Error("Logic error - bad direction (not h/v");
  }

  // TODO this is because of typescript -_-
  const direction =
    selectedSquare.selection === VERTICAL ? VERTICAL : HORIZONTAL;

  let currentSquare = selectedSquare;

  const allGood = currentPlay.every((pt) => {
    if (currentSquare.tile) {
      return false;
    }
    const nextLocation = currentSquare.next[direction];

    if (!nextLocation) {
      // we have fallen off the edge of the board
      return false;
    }
    currentSquare = squares[nextLocation];
    return true;
  });

  return allGood;
};

export const selectSquares = (state: RootState) => state.board.squares;

export const selectPlayTiles = (state: RootState) => state.board.currentPlay;

export default slice.reducer;
