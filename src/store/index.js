import { configureStore } from "@reduxjs/toolkit";
import characterReducer from "./slices/characterSlice";
import raceReducer from "./slices/raceSlice";
import professionReducer from "./slices/professionSlice";
import playerReducer from "./slices/playerSlice.js";

export const store = configureStore({
   reducer: {
      character: characterReducer,
      race: raceReducer,
      profession: professionReducer,
      player: playerReducer,
   },
});
