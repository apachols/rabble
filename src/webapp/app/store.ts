import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import rackReducer from "../features/rabble/rackSlice";

export const store = configureStore({
  reducer: {
    rack: rackReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
