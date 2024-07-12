// songSlice.js
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
        updateSongDetails: (state, action) => {
            const { id, title, artist, image } = action.payload;
            const song = state.songsList.find(song => song.id === id);
            if (song) {
                song.title = title;
                song.artist = artist;
                song.image = image;
            }
        }
    },
});

export const { changeSong, addSong, updateSongDetails } = songSlice.actions;

export default songSlice.reducer;
