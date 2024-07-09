import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentSong: null,
    songsList: [],
};

const songSlice = createSlice({
    name: "song",
    initialState ,
    reducers: {
        changeSong: (state, action) => {
            state.currentSong = action.payload;
        },
        addSong: (state, action) => {
            state.songsList.push(action.payload);
        },
        removeSong(state, action) {
            state.songsList = state.songsList.filter(song => song.id !== action.payload);
        },
        updateSongDetails: (state, action) => {
            const { id, title, artist } = action.payload;
            const song = state.songsList.find(song => song.id === id);
            if (song) {
                song.title = title;
                song.artist = artist;
            }
        }
    },
});

export const { changeSong, addSong, removeSong, updateSongDetails } = songSlice.actions;

export default songSlice.reducer;
