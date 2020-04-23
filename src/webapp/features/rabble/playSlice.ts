import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface PlayState {
  playTiles: Tile[];
}

const initialState: PlayState = {
  playTiles: [],
};

export const slice = createSlice({
  name: "play",
  initialState,
  reducers: {
    updatePlayTiles: (state, action: PayloadAction<Tile[]>) => {
      state.playTiles = [...action.payload];
    },
  },
});

export const { updatePlayTiles } = slice.actions;

export const selectPlayTiles = (state: RootState) => state.play.playTiles;

export default slice.reducer;
