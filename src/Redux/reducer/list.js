import { createSlice } from "@reduxjs/toolkit";
import { MusicList, PlayList } from "../../data";

const initialState = {
    value: MusicList,
    playlists: PlayList, // Додали початковий стан для плейлистів
};

export const list = createSlice({
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
            state.playlists = state.playlists.filter(
                (playlist) => playlist.id !== action.payload
            );
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
        removeSongFromPlaylist: (state, action) => {
            const { playlistId, songId } = action.payload;
            const playlist = state.playlists.find(pl => pl.id === playlistId);
            if (playlist) {
                playlist.songs = playlist.songs.filter(s => s.id !== songId);
            }
        }
    },
});

export const { changeList, addPlaylist, removePlaylist, changePlaylist, addSongToPlaylist, removeSongFromPlaylist } = list.actions;

export default list.reducer;
