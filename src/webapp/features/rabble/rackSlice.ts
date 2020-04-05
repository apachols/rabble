import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState /* , AppThunk */ } from "../../app/store";
import { shuffleTiles } from "../../../game/tileBag";

interface RackState {
  tileRack: Tile[];
}

const initialState: RackState = {
  tileRack: []
};

export const slice = createSlice({
  name: "rack",
  initialState,
  reducers: {
    shuffleRack: state => {
      shuffleTiles(state.tileRack);
    },
    updateTiles: (state, action: PayloadAction<Tile[]>) => {
      state.tileRack = [...action.payload];
    }
  }
});

export const { shuffleRack, updateTiles } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectTileRack = (state: RootState) => state.rack.tileRack;

export default slice.reducer;
