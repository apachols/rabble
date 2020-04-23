import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import rackReducer from "../features/rabble/rackSlice";
import playReducer from "../features/rabble/playSlice";

export const store = configureStore({
  reducer: {
    rack: rackReducer,
    play: playReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
