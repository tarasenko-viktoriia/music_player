import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    playAudio,
    pauseAudio,
    stopAudio,
    playNextTrack,
    playPrevTrack,
    setAudioCurrentTime,
    setVolume,
    addTrackToPlaylist
} from '../Redux/playerSlice';

const PlayerControls = () => {
    const dispatch = useDispatch();
    const { isPlaying, currentTime, volume, playlist } = useSelector(state => state.player);

    const handlePlay = () => {
        dispatch(playAudio());
    };

    const handlePause = () => {
        dispatch(pauseAudio());
    };

    const handleStop = () => {
        dispatch(stopAudio());
    };

    const handleNext = () => {
        dispatch(playNextTrack());
    };

    const handlePrev = () => {
        dispatch(playPrevTrack());
    };

    const handleTimeChange = (event) => {
        dispatch(setAudioCurrentTime(event.target.value));
    };

    const handleVolumeChange = (event) => {
        dispatch(setVolume(event.target.value));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const newTrack = {
                _id: new Date().getTime().toString(),
                url: url,
                name: file.name
            };
            dispatch(addTrackToPlaylist(newTrack));
        }
    };

    return (
        <div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleNext}>Next</button>
            <button onClick={handlePrev}>Prev</button>
            <input
                type="range"
                value={currentTime}
                onChange={handleTimeChange}
                min="0"
                max="100"
            />
            <input
                type="range"
                value={volume}
                onChange={handleVolumeChange}
                min="0"
                max="1"
                step="0.01"
            />
            <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
            />
        </div>
    );
};

export default PlayerControls;
