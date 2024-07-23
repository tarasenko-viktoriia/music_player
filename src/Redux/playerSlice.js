import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPlaying: false,
    isStopped: true,
    duration: 0,
    track: { _id: '', url: '', name: '', artist: '' }, 
    playlist: { _id: '', title: '', tracks: [] },
    playlistIndex: 0,
    currentTime: 0,
    volume: 1.0
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        play: (state) => {
            state.isPlaying = true;
            state.isStopped = false;
        },
        pause: (state) => {
            state.isPlaying = false;
        },
        stop: (state) => {
            state.isPlaying = false;
            state.isStopped = true;
            state.currentTime = 0;
        },
        setTrack: (state, action) => {
            state.track = state.playlist.tracks[action.payload];
            state.playlistIndex = action.payload;
            state.currentTime = 0;
        },
        setDuration: (state, action) => {
            state.duration = action.payload;
        },
        setPlaylist: (state, action) => {
            state.playlist = action.payload;
            state.playlistIndex = 0;
            state.track = state.playlist.tracks[0] || { _id: '', url: '', name: '', artist: '' }; 
            state.currentTime = 0;
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        },
    },
});

export const { play, pause, stop, setTrack, setDuration, setPlaylist, setCurrentTime, setVolume } = playerSlice.actions;
export default playerSlice.reducer;
