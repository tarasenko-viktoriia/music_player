import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTime, setDuration, nextTrack } from '../Redux/playerSlice';

const AudioPlayer = () => {
    const audioRef = useRef(new Audio());
    const dispatch = useDispatch();
    const { isPlaying, isStopped, track, currentTime, volume } = useSelector((state) => state.player);
    const progressRef = useRef(0); // референційний об'єкт для зберігання прогресу
    const volumeRef = useRef(volume * 100);

    useEffect(() => {
        const audio = audioRef.current;
        audio.src = track.url;
        audio.currentTime = currentTime;

        // Обробники подій
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            // Прибирання обробників подій при розмонтуванні компонента
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [track]);

    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.play().catch((error) => {
                console.error('Error playing audio:', error);
            });
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (isStopped) {
            audio.currentTime = 0;
            audio.pause();
        }
    }, [isStopped]);

    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume;
    }, [volume]);

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        progressRef.current = (currentTime / duration) * 100;
        dispatch(setCurrentTime(currentTime));
    };

    const handleDurationChange = () => {
        dispatch(setDuration(audioRef.current.duration));
    };

    const handleEnded = () => {
        dispatch(nextTrack());
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const duration = audio.duration;
        const seekTime = (e.target.value / 100) * duration;
        audio.currentTime = seekTime;
        progressRef.current = e.target.value; 
    };

    const handleVolumeChange = (e) => {
        const audio = audioRef.current;
        const volume = e.target.value / 100;
        audio.volume = volume;
        volumeRef.current = e.target.value; // оновлення гучності
    };

    return (
        <div>
            <input
                type="range"
                min="0"
                max="100"
                value={progressRef.current}
                onChange={handleSeek}
                style={{ width: '100%' }}
            />
            <input
                type="range"
                min="0"
                max="100"
                value={volumeRef.current}
                onChange={handleVolumeChange}
                style={{ width: '100%' }}
            />
        </div>
    );
};

export default AudioPlayer;
