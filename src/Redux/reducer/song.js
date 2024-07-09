import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentSong: null,
    songsList: [],
};

const songSlice = createSlice({
    name: "song",
    initialState,
    reducers: {
        changeSong: (state, action) => {
            state.currentSong = action.payload;
        },
        addSong: (state, action) => {
            state.songsList.push(action.payload);
        },
        removeSong(state, action) {
            // Видалення пісні з бібліотеки за ідентифікатором
            state.songsList = state.songsList.filter(song => song.id !== action.payload);
          },
    },
});

export const { changeSong, addSong, removeSong } = songSlice.actions;

export default songSlice.reducer;
