import { createSlice } from "@reduxjs/toolkit";
import { MusicList, PlayList } from "../../data"; 

const initialState = {
    value: MusicList,
    playlists: PlayList,
};

const listSlice = createSlice({
    name: "list",
    initialState,
    reducers: {
        changeList: (state, action) => {
            state.value = action.payload;
        },
        addPlaylist: (state, action) => {
            state.playlists.push(action.payload);
        },
        removePlaylist: (state, action) => {
            const playlistId = action.payload;
            state.playlists = state.playlists.filter(playlist => playlist.id !== playlistId);
        },
        changePlaylist: (state, action) => {
            const { id, title, imgUrl } = action.payload;
            const playlistToEdit = state.playlists.find(pl => pl.id === id);
            if (playlistToEdit) {
                playlistToEdit.title = title || playlistToEdit.title;
                playlistToEdit.imgUrl = imgUrl || playlistToEdit.imgUrl;
            }
        },
        addSongToPlaylist: (state, action) => {
            const { playlistId, song } = action.payload;
            const playlist = state.playlists.find(pl => pl.id === playlistId);
            if (playlist && !playlist.songs.some(s => s.id === song.id)) {
                playlist.songs.push(song);
            }
        },
        moveSongUp: (state, action) => {
            const { playlistId, songId } = action.payload;
            const playlist = state.playlists.find(pl => pl.id === playlistId);
            if (playlist) {
                const index = playlist.songs.findIndex(song => song.id === songId);
                if (index > 0) {
                    const movedSong = playlist.songs[index];
                    playlist.songs.splice(index, 1); 
                    playlist.songs.splice(index - 1, 0, movedSong); 
                }
            }
        },

        moveSongDown: (state, action) => {
            const { playlistId, songId } = action.payload;
            const playlist = state.playlists.find(pl => pl.id === playlistId);
            if (playlist) {
                const index = playlist.songs.findIndex(song => song.id === songId);
                if (index !== -1 && index < playlist.songs.length - 1) {
                    const movedSong = playlist.songs[index];
                    playlist.songs.splice(index, 1); 
                    playlist.songs.splice(index + 1, 0, movedSong); 
                }
            }
        },
    },
});

export const {
    changeList,
    addPlaylist,
    removePlaylist,
    changePlaylist,
    addSongToPlaylist,
    moveSongUp,
    moveSongDown
} = listSlice.actions;

export default listSlice.reducer;
