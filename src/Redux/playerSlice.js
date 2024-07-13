import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPlaying: false,
    isStopped: true,
    duration: 0,
    track: { _id: '', url: '', name: '' },
    playlist: { _id: '', name: '', tracks: [] },
    playlistIndex: 0,
    currentTime: 0,
    volume: 1.0
};

const playerSlice = createSlice({
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
            state.track = action.payload;
            state.currentTime = 0; // Встановлюємо початковий час при зміні треку
        },
        setDuration: (state, action) => {
            state.duration = action.payload;
        },
        nextTrack: (state) => {
            if (state.playlist.tracks.length > 0) {
                state.playlistIndex = (state.playlistIndex + 1) % state.playlist.tracks.length;
                state.track = state.playlist.tracks[state.playlistIndex];
                state.currentTime = 0;
            }
        },
        prevTrack: (state) => {
            if (state.playlist.tracks.length > 0) {
                state.playlistIndex = (state.playlistIndex - 1 + state.playlist.tracks.length) % state.playlist.tracks.length;
                state.track = state.playlist.tracks[state.playlistIndex];
                state.currentTime = 0;
            }
        },
        setPlaylist: (state, action) => {
            state.playlist = action.payload;
            state.playlistIndex = 0;
            state.track = state.playlist.tracks[0] || { _id: '', url: '', name: '' };
            state.currentTime = 0;
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        },
        addTrackToPlaylist: (state, action) => {
            state.playlist.tracks.push(action.payload);
        }
    }
});

export const {
    play,
    pause,
    stop,
    setTrack,
    setDuration,
    nextTrack,
    prevTrack,
    setPlaylist,
    setCurrentTime,
    setVolume,
    addTrackToPlaylist
} = playerSlice.actions;

export default playerSlice.reducer;