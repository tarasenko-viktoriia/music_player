import { configureStore } from "@reduxjs/toolkit";
import listReducer from "./reducer/list";
import songReducer from "./reducer/song";
import playerReducer from './playerSlice';

export const store = configureStore({
    reducer: {
        list: listReducer,
        song: songReducer,
        player: playerReducer,
    },
});
