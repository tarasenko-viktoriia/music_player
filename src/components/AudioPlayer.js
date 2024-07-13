import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTime, setDuration, nextTrack } from '../Redux/playerSlice';

const AudioPlayer = () => {
    const audioRef = useRef(new Audio());
    const dispatch = useDispatch();
    const { isPlaying, isStopped, track, currentTime, volume } = useSelector((state) => state.player);
    const [durationDisplay, setDurationDisplay] = useState('0:00');
    const volumeRef = useRef(volume * 100);

    useEffect(() => {
        const audio = audioRef.current;
        audio.src = track.url;
        audio.currentTime = currentTime;

        if (isPlaying) {
            audio.play().catch((error) => {
                console.error('Error playing audio:', error);
            });
        } else {
            audio.pause();
        }

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [track, isPlaying]);

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
        volumeRef.current = volume * 100;
    }, [volume]);

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        const currentTime = audio.currentTime;
        dispatch(setCurrentTime(currentTime));
    };

    const handleDurationChange = () => {
        const audio = audioRef.current;
        const duration = audio.duration;
        dispatch(setDuration(duration));

        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        setDurationDisplay(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    const handleEnded = () => {
        dispatch(nextTrack());
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const duration = audio.duration;
        const seekTime = (e.target.value / 100) * duration;
        audio.currentTime = seekTime;
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
                value={(currentTime / audioRef.current.duration) * 100}
                onChange={handleSeek}
                style={{ width: '100%' }}
            />
            <div>{durationDisplay}</div>
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