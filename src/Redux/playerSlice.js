import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const audio = new Audio();

const audioStateListener = (dispatch) => {
    audio.onended = () => {
        dispatch(playNextTrack());
    };

    audio.ondurationchange = () => {
        dispatch(setDuration(audio.duration));
    };

    audio.ontimeupdate = () => {
        dispatch(setCurrentTime(audio.currentTime));
    };
};

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

export const playAudio = createAsyncThunk('player/playAudio', async (_, { dispatch }) => {
    await audio.play();
    dispatch(play());
});

export const pauseAudio = createAsyncThunk('player/pauseAudio', async (_, { dispatch }) => {
    audio.pause();
    dispatch(pause());
});

export const stopAudio = createAsyncThunk('player/stopAudio', async (_, { dispatch }) => {
    audio.pause();
    audio.currentTime = 0;
    dispatch(stop());
});

export const setAudioTrack = createAsyncThunk('player/setAudioTrack', async (trackIndex, { dispatch, getState }) => {
    const state = getState();
    const track = state.player.playlist.tracks[trackIndex];
    if (track) {
        audio.src = track.url;
        audio.currentTime = 0;
        await audio.play();
        dispatch(setTrack(trackIndex));
        dispatch(play());
    }
});

export const playNextTrack = createAsyncThunk('player/playNextTrack', async (_, { dispatch, getState }) => {
    const state = getState();
    const nextIndex = (state.player.playlistIndex + 1) % state.player.playlist.tracks.length;
    dispatch(setAudioTrack(nextIndex));
    dispatch(nextTrack());
});

export const playPrevTrack = createAsyncThunk('player/playPrevTrack', async (_, { dispatch, getState }) => {
    const state = getState();
    const prevIndex = (state.player.playlistIndex - 1 + state.player.playlist.tracks.length) % state.player.playlist.tracks.length;
    dispatch(setAudioTrack(prevIndex));
    dispatch(prevTrack());
});

export const setAudioPlaylist = createAsyncThunk('player/setAudioPlaylist', async (playlist, { dispatch }) => {
    dispatch(setPlaylist(playlist));
    if (playlist.tracks.length > 0) {
        dispatch(setAudioTrack(0));
    }
});

export const setAudioCurrentTime = createAsyncThunk('player/setAudioCurrentTime', async (currentTime, { dispatch }) => {
    audio.currentTime = currentTime;
    dispatch(setCurrentTime(currentTime));
});

export const addTrackToPlaylist = createAsyncThunk('player/addTrackToPlaylist', async (track, { dispatch, getState }) => {
    const state = getState();
    const updatedPlaylist = {
        ...state.player.playlist,
        tracks: [...state.player.playlist.tracks, track]
    };
    dispatch(setAudioPlaylist(updatedPlaylist));

    if (!state.player.isPlaying) {
        dispatch(setAudioTrack(updatedPlaylist.tracks.length - 1));
    }
});

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
            state.track = state.playlist.tracks[0] || { _id: '', url: '', name: '' };
            state.currentTime = 0;
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
            audio.volume = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTrackToPlaylist.fulfilled, (state, action) => {
        });
    },
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
} = playerSlice.actions;

export const audioMiddleware = (store) => (next) => (action) => {
    audioStateListener(store.dispatch);
    return next(action);
};

export default playerSlice.reducer;