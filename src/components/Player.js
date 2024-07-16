import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    playAudio,
    pauseAudio,
    stopAudio,
    playNextTrack,
    playPrevTrack,
    setAudioCurrentTime,
    setVolume
} from '../Redux/playerSlice';

const Player = () => {
    const dispatch = useDispatch();
    const { isPlaying, currentTime, volume } = useSelector(state => state.player);

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

    return (
        <div>
            <audio id="audio" />
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
        </div>
    );
};

export default Player;
