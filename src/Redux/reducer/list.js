import { createSlice } from "@reduxjs/toolkit";
import { MusicList } from "../../data";


const initialState = {
    value: MusicList,
};

export const list = createSlice ({
    name: "list",
    initialState,
    reducers: {
        changeList: (state, action) => {
            state.value = action.payload
        }
    }
});

export const {changeList} = list.actions;

export default list.reducer;