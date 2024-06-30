import { configureStore } from "@reduxjs/toolkit";
import listReducer from "./reducer/list";
import songReducer from "./reducer/song";

export const store = configureStore({
    reducer: {
        list: listReducer,
        song: songReducer,
    }
})