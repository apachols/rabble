import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import rackReducer from "../features/rabble/rackSlice";
import boardReducer from "../features/rabble/boardSlice";

export const store = configureStore({
  reducer: {
    board: boardReducer,
    rack: rackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
