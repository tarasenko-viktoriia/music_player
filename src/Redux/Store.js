import { configureStore } from "@reduxjs/toolkit";
import playerReducer, { audioMiddleware }  from '../Redux/playerSlice';
import {thunk} from 'redux-thunk';
import listReducer from "./reducer/list";
import songReducer from "./reducer/song";

export const store = configureStore({
    reducer: {
        list: listReducer,
        song: songReducer,
        player: playerReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(audioMiddleware),
  });
