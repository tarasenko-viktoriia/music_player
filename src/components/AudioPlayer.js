import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTime, setDuration, nextTrack, play, pause, stop } from '../Redux/playerSlice';

const AudioPlayer = () => {
    const audioRef = useRef(null);
    const dispatch = useDispatch();
    const { isPlaying, track, currentTime, volume } = useSelector((state) => state.player);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
            if (track.url) {
                audio.src = track.url;
                if (isPlaying) {
                    audio.play().catch((error) => {
                        console.error('Error playing audio:', error);
                    });
                } else {
                    audio.pause();
                }
            }
        }
    }, [isPlaying, track, volume]);

    const handleTimeUpdate = () => {
        dispatch(setCurrentTime(audioRef.current.currentTime));
    };

    const handleDurationChange = () => {
        dispatch(setDuration(audioRef.current.duration));
    };

    const handleEnded = () => {
        dispatch(nextTrack());
    };

    return (
        <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            onEnded={handleEnded}
            controls
        />
    );
};

export default AudioPlayer;