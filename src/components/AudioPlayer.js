
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTime, setDuration, nextTrack } from '../Redux/playerSlice';

const AudioPlayer = () => {
    const audioRef = useRef(null);
    const dispatch = useDispatch();
    const { isPlaying, isStopped, track, currentTime, volume } = useSelector((state) => state.player);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio && track.url) {
            audio.src = track.url;
            audio.currentTime = currentTime; 
        }
    }, [track]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.play().catch((error) => {
                    console.error('Error playing audio:', error);
                });
            } else {
                audio.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio && isStopped) {
            audio.currentTime = 0; // Встановлюємо поточний час у 0 при зупинці
            audio.pause();
        }
    }, [isStopped]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

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