import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null,
    currentSong: null,
    songsList: [],
};

const songSlice = createSlice({
    name: "song",
    initialState,
    reducers: {
        changeSong: (state, action) => {
            state.value = action.payload;
        },
        addSong: (state, action) => {
            state.songsList.push(action.payload);
        },
        updateSongDetails: (state, action) => {
            const { id, title, artist, image } = action.payload;
            const song = state.songsList.find(song => song.id === id);
            if (song) {
                song.title = title;
                song.artist = artist;
                song.image = image;
            }
        },
        moveSongUp: (state, action) => {
            const index = state.songsList.findIndex(song => song.id === action.payload);
            if (index > 0) {
                const temp = state.songsList[index];
                state.songsList[index] = state.songsList[index - 1];
                state.songsList[index - 1] = temp;
            }
        },
        moveSongDown: (state, action) => {
            const index = state.songsList.findIndex(song => song.id === action.payload);
            if (index < state.songsList.length - 1) {
                const temp = state.songsList[index];
                state.songsList[index] = state.songsList[index + 1];
                state.songsList[index + 1] = temp;
            }
        },
    },
});

export const { changeSong, addSong, updateSongDetails, moveSongUp, moveSongDown } = songSlice.actions;

export default songSlice.reducer;
