import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState /* , AppThunk */ } from "../../app/store";
import { shuffleTiles } from "../../../game/tileBag";

interface RackState {
  tileRack: Tile[];
}

const initialState: RackState = {
  tileRack: [],
};

export const slice = createSlice({
  name: "rack",
  initialState,
  reducers: {
    shuffleRack: (state) => {
      shuffleTiles(state.tileRack);
    },
    updateRackTiles: (state, action: PayloadAction<Tile[]>) => {
      state.tileRack = [...action.payload];
    },
  },
});

export const { shuffleRack, updateRackTiles } = slice.actions;

export const selectTileRack = (state: RootState) => state.rack.tileRack;

export default slice.reducer;
