import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState /* , AppThunk */ } from "../../app/store";
import { shuffleTiles } from "../../../game/tileBag";
import { generateBoard } from "../../../game/board";

interface BoardState {
  squares: Square[];
  selected: number | null;
}

const boardConfig = generateBoard();

const initialState: BoardState = {
  selected: null,
  squares: boardConfig,
};

const getNextSelection = (current: string | null): string | null => {
  switch (current) {
    case "H":
      return "V";
    case "V":
      return null;
  }
  return "H";
};

export const slice = createSlice({
  name: "board",
  initialState,
  reducers: {
    changeSquareSelection: (state, action: PayloadAction<number>) => {
      const newSelectedLocation = action.payload;
      const newSelectedSquare = state.squares[newSelectedLocation];
      if (newSelectedSquare.tile) {
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
        return;
      }

      // Unselect the current square and select a new square
      currentSelectedSquare.selection = null;
      newSelectedSquare.selection = getNextSelection(null);
      state.selected = newSelectedLocation;
    },
  },
});

export const { changeSquareSelection } = slice.actions;

export const selectSquares = (state: RootState) => state.board.squares;

export default slice.reducer;
