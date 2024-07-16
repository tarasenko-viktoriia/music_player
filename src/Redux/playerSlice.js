import { createSlice } from '@reduxjs/toolkit';

const audio = new Audio();

const audioStateListener = (dispatch) => {
    audio.onended = () => {
        dispatch(playerSlice.actions.playNextTrack());
    };

    audio.ondurationchange = () => {
        dispatch(playerSlice.actions.setDuration(audio.duration));
    };

    audio.ontimeupdate = () => {
        dispatch(playerSlice.actions.setCurrentTime(audio.currentTime));
    };
};

const initialState = {
    isPlaying: false,
    isStopped: true,
    duration: 0,
    track: { _id: '', url: '', title: '', artist: '' },
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
        nextTrack: (state) => {
            state.playlistIndex = (state.playlistIndex + 1) % state.playlist.tracks.length;
            state.track = state.playlist.tracks[state.playlistIndex];
            state.currentTime = 0;
        },
        prevTrack: (state) => {
            state.playlistIndex = (state.playlistIndex - 1 + state.playlist.tracks.length) % state.playlist.tracks.length;
            state.track = state.playlist.tracks[state.playlistIndex];
            state.currentTime = 0;
        },
        setPlaylist: (state, action) => {
            state.playlist = action.payload;
            state.playlistIndex = 0;
            state.track = state.playlist.tracks[0] || { _id: '', url: '', title: '', artist: '' };
            state.currentTime = 0;
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
            audio.volume = action.payload;
        },
        updateSongDetails: (state, action) => {
            const { id, title, artist } = action.payload;
            const song = state.playlist.tracks.find(track => track._id === id);
            if (song) {
                song.title = title;
                song.artist = artist;
            }
        },
        addTrackToPlaylist: (state, action) => {
            const track = action.payload;
            state.playlist.tracks.push({
                _id: track._id,
                url: track.url,
                title: track.name, // Тут використовуємо track.name для title
                artist: track.artist  // Можна встановити "Unknown Artist" за замовчуванням
            });
            console.log('Add Track:', track); // Debug log
        },
    },
});

export const { play, pause, stop, setTrack, setDuration, nextTrack, prevTrack, setPlaylist, setCurrentTime, setVolume, updateSongDetails, addTrackToPlaylist } = playerSlice.actions;

export const audioMiddleware = (store) => (next) => (action) => {
    audioStateListener(store.dispatch);
    return next(action);
};

// Ваші функції-дії без використання createAsyncThunk
export const playAudio = () => (dispatch) => {
    audio.play();
    dispatch(play());
};

export const pauseAudio = () => (dispatch) => {
    audio.pause();
    dispatch(pause());
};

export const stopAudio = () => (dispatch) => {
    audio.pause();
    audio.currentTime = 0;
    dispatch(stop());
};

export const setAudioTrack = (trackIndex) => (dispatch, getState) => {
    const state = getState();
    const track = state.player.playlist.tracks[trackIndex];
    if (track) {
        audio.src = track.url;
        audio.currentTime = 0;
        audio.play();
        dispatch(setTrack(trackIndex));
        dispatch(play());
    }
};

export const playNextTrack = () => (dispatch, getState) => {
    const state = getState();
    const nextIndex = (state.player.playlistIndex + 1) % state.player.playlist.tracks.length;
    dispatch(setAudioTrack(nextIndex));
    dispatch(nextTrack());
};

export const playPrevTrack = () => (dispatch, getState) => {
    const state = getState();
    const prevIndex = (state.player.playlistIndex - 1 + state.player.playlist.tracks.length) % state.player.playlist.tracks.length;
    dispatch(setAudioTrack(prevIndex));
    dispatch(prevTrack());
};

export const setAudioPlaylist = (playlist) => (dispatch) => {
    dispatch(setPlaylist(playlist));
    if (playlist.tracks.length > 0) {
        dispatch(setAudioTrack(0));
    }
};

export const setAudioCurrentTime = (currentTime) => (dispatch) => {
    audio.currentTime = currentTime;
    dispatch(setCurrentTime(currentTime));
};

export const addTrackToPlaylistAction = (track) => (dispatch) => {
    dispatch(addTrackToPlaylist(track));
};

export default playerSlice.reducer;