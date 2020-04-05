import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import rackReducer from "../features/rabble/rackSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    rack: rackReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
