import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    value: null,
};

const list = createSlice({
    name: "song",
    initialState,
    reducers: {
        changeSong: (state, action) => {
            state.value = action.payload
        }
    }
});

export const {changeSong} = list.actions;

export default list.reducer;