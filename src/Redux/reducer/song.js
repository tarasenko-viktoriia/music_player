// songSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentSong: null,
    songsList: [],
    playlists: [], // додано ключ playlists до початкового стану
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
        moveSongUp: (state, action) => {
            const { songId } = action.payload;
            const currentIndex = state.songsList.findIndex(song => song.id === songId);
            if (currentIndex > 0) {
                const currentSong = state.songsList[currentIndex];
                state.songsList.splice(currentIndex, 1); 
                state.songsList.splice(currentIndex - 1, 0, currentSong); 
            }
        },
        moveSongDown: (state, action) => {
            const { songId } = action.payload;
            const currentIndex = state.songsList.findIndex(song => song.id === songId);
            if (currentIndex < state.songsList.length - 1) {
                const currentSong = state.songsList[currentIndex];
                state.songsList.splice(currentIndex, 1); // видаляємо поточну пісню
                state.songsList.splice(currentIndex + 1, 0, currentSong); // вставляємо її на нову позицію
            }
        },
        updateSongDetails: (state, action) => {
            const { id, title, artist } = action.payload;
            const song = state.songsList.find((song) => song.id === id);
            if (song) {
                song.title = title;
                song.artist = artist;
            }
        },
        deleteSong: (state, action) => {
            const songId = action.payload;
            
            state.songsList = state.songsList.filter(song => song.id !== songId);
            
            state.playlists.forEach(playlist => {
                playlist.songs = playlist.songs.filter(song => song.id !== songId);
            });
        },
        
    },
});

export const { changeSong, addSong, updateSongDetails, moveSongUp, moveSongDown, deleteSong } = songSlice.actions;

export const selectSongsList = (state) => state.song.songsList;
export const selectCurrentSong = (state) => state.song.currentSong;

export const isFirstSong = (state, songId) => {
    const songsList = selectSongsList(state);
    return songsList.length > 0 && songsList[0].id === songId;
};

export const isLastSong = (state, songId) => {
    const songsList = selectSongsList(state);
    return songsList.length > 0 && songsList[songsList.length - 1].id === songId;
};

export default songSlice.reducer;
