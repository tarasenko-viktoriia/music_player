<<<<<<< HEAD
=======
// songSlice.js

>>>>>>> c6d98c1673d88da8073362e01777c657ec05c86d
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
<<<<<<< HEAD
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
=======
        deleteSong: (state, action) => {
            const songId = action.payload;
            
            // Видаляємо пісню зі списку пісень
            state.songsList = state.songsList.filter(song => song.id !== songId);
            
            // Видаляємо пісню з усіх плейлистів
            state.playlists.forEach(playlist => {
                playlist.songs = playlist.songs.filter(song => song !== songId);
            });
        },

        deleteSong: (state, action) => {
            const songId = action.payload;
        
            // Видаляємо пісню зі списку пісень
            state.songsList = state.songsList.filter(song => song.id !== songId);
            
            // Видаляємо пісню з усіх плейлистів
            state.playlists.forEach(playlist => {
                playlist.songs = playlist.songs.filter(song => song !== songId);
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
>>>>>>> c6d98c1673d88da8073362e01777c657ec05c86d

export default songSlice.reducer;
