// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { changeSong } from "../Redux/reducer/song";
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import ShuffleIcon from '@mui/icons-material/Shuffle';
// import RepeatIcon from '@mui/icons-material/Repeat';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// export default function Player() {
//     const currentSong = useSelector(state => state.song.currentSong);
//     const songsList = useSelector(state => state.song.songsList);
//     const audioRef = useRef(null);
//     const [songTitle, setSongTitle] = useState("");
//     const [playbackMode, setPlaybackMode] = useState("normal");
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [shuffleList, setShuffleList] = useState([]);
//     const [shuffleIndex, setShuffleIndex] = useState(0);
//     const [volume, setVolume] = useState(1);
//     const [showVolumeControl, setShowVolumeControl] = useState(false);
//     const [duration, setDuration] = useState(0);
//     const [currentTime, setCurrentTime] = useState(0);

//     const dispatch = useDispatch();

//     const index = songsList.findIndex((item) => item.id === currentSong?.id);

//     const isPrev = () => (playbackMode === "shuffle" ? shuffleIndex > 0 : index > 0) && songsList.length > 1;
//     const isNext = () => songsList.length > 1;

//     useEffect(() => {
//         const player = audioRef.current;

//         const handleCanPlay = () => {
//             setSongTitle(currentSong?.title);
//             setDuration(player.duration);
//         };

//         const handleTimeUpdate = () => {
//             setCurrentTime(player.currentTime);
//         };

//         const handleEnded = () => {
//             setIsPlaying(false);
//             if (playbackMode === "normal") {
//                 if (index < songsList.length - 1) {
//                     changeAndPlaySong(songsList[index + 1]);
//                 } else {
//                     changeAndPlaySong(songsList[0]);
//                 }
//             } else if (playbackMode === "shuffle") {
//                 if (shuffleIndex < shuffleList.length - 1) {
//                     setShuffleIndex(shuffleIndex + 1);
//                     changeAndPlaySong(shuffleList[shuffleIndex + 1]);
//                 } else {
//                     const newShuffleList = shuffleArray([...songsList]);
//                     setShuffleList(newShuffleList);
//                     setShuffleIndex(0);
//                     changeAndPlaySong(newShuffleList[0]);
//                 }
//             } else if (playbackMode === "repeat") {
//                 changeAndPlaySong(currentSong);
//             }
//         };

//         const handlePlay = () => {
//             setIsPlaying(true);
//         };

//         const handlePause = () => {
//             setIsPlaying(false);
//         };

//         player.addEventListener('canplay', handleCanPlay);
//         player.addEventListener('timeupdate', handleTimeUpdate);
//         player.addEventListener('ended', handleEnded);
//         player.addEventListener('play', handlePlay);
//         player.addEventListener('pause', handlePause);

//         return () => {
//             player.removeEventListener('canplay', handleCanPlay);
//             player.removeEventListener('timeupdate', handleTimeUpdate);
//             player.removeEventListener('ended', handleEnded);
//             player.removeEventListener('play', handlePlay);
//             player.removeEventListener('pause', handlePause);
//         };
//     }, [currentSong, playbackMode, shuffleIndex, shuffleList, index]);

//     useEffect(() => {
//         if (playbackMode === "shuffle") {
//             const newShuffleList = shuffleArray([...songsList]);
//             setShuffleList(newShuffleList);
//             setShuffleIndex(0);
//         }
//     }, [playbackMode, songsList]);

//     const changeAndPlaySong = (newSong) => {
//         const player = audioRef.current;

//         dispatch(changeSong(newSong));

//         setTimeout(() => {
//             if (!player.paused) {
//                 player.pause();
//             }
//             player.load();
//             player.play();
//         }, 100);
//     };

//     const toggleNormalMode = () => {
//         setPlaybackMode("normal");
//     };

//     const toggleShuffleMode = () => {
//         setPlaybackMode("shuffle");
//     };

//     const shuffleArray = (array) => {
//         for (let i = array.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [array[i], array[j]] = [array[j], array[i]];
//         }
//         return array;
//     };

//     const togglePlayPause = () => {
//         const player = audioRef.current;
//         if (isPlaying) {
//             player.pause();
//         } else {
//             player.play();
//         }
//     };

//     const handleVolumeChange = (event) => {
//         const newVolume = event.target.value;
//         setVolume(newVolume);
//         audioRef.current.volume = newVolume;
//     };

//     const toggleVolumeControl = () => {
//         setShowVolumeControl(!showVolumeControl);
//     };

//     const handleSliderChange = (event) => {
//         const newTime = event.target.value;
//         audioRef.current.currentTime = newTime;
//         setCurrentTime(newTime);
//     };

//     const formatTime = (time) => {
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.floor(time % 60);
//         return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
//     };

//     return (
//             <div className="player">
//               <div className={`equalizer ${isPlaying ? 'playing' : ''}`}>
//                 <div className="bar bar1"></div>
//                 <div className="bar bar2"></div>
//                 <div className="bar bar3"></div>
//                 <div className="bar bar4"></div>
//                 <div className="bar bar5"></div>
//               </div>
//               <div className="name">{songTitle}</div>
//               <div className="player-row">
//                 <div className="volume-control-wrapper">
//                   <div className="player-controls volume-button" onClick={toggleVolumeControl}>
//                     <VolumeUpIcon />
//                   </div>
//                   {showVolumeControl && (
//                     <div className="volume-control">
//                       <input
//                         type="range"
//                         min="0"
//                         max="1"
//                         step="0.01"
//                         value={volume}
//                         onChange={handleVolumeChange}
//                         className="vertical-slider"
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <div className="time-slider-container">
//                   <span className="current-time">{formatTime(currentTime)}</span>
//                   <input
//                     type="range"
//                     min="0"
//                     max={duration}
//                     step="0.1"
//                     value={currentTime}
//                     onChange={handleSliderChange}
//                     className="time-slider"
//                   />
//                   <span className="duration">{formatTime(duration)}</span>
//                 </div>
//               </div>
//               <div className="player-row">
//                 <div className="player-controls" onClick={toggleShuffleMode}>
//                   <ShuffleIcon />
//                 </div>
//                 <div className={`player-controls ${!isPrev() && "cursor-disabled"}`} onClick={() => {
//                   if (isPrev()) {
//                     if (playbackMode === "shuffle") {
//                       setShuffleIndex(shuffleIndex - 1);
//                       changeAndPlaySong(shuffleList[shuffleIndex - 1]);
//                     } else {
//                       changeAndPlaySong(songsList[index - 1]);
//                     }
//                   }
//                 }}>
//                   <ArrowBackIosIcon />
//                 </div>
//                 <div className="player-controls play-pause" onClick={togglePlayPause}>
//                   {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
//                 </div>
//                 <audio ref={audioRef} id="audio">
//                   <source src={currentSong?.file} type="audio/mpeg" />
//                 </audio>
//                 <div className={`player-controls ${!isNext() && "cursor-disabled"}`} onClick={() => {
//                   if (isNext()) {
//                     if (playbackMode === "shuffle") {
//                       if (shuffleIndex < shuffleList.length - 1) {
//                         setShuffleIndex(shuffleIndex + 1);
//                         changeAndPlaySong(shuffleList[shuffleIndex + 1]);
//                       } else {
//                         const newShuffleList = shuffleArray([...songsList]);
//                         setShuffleList(newShuffleList);
//                         setShuffleIndex(0);
//                         changeAndPlaySong(newShuffleList[0]);
//                       }
//                     } else {
//                       if (index < songsList.length - 1) {
//                         changeAndPlaySong(songsList[index + 1]);
//                       } else {
//                         changeAndPlaySong(songsList[0]);
//                       }
//                     }
//                   }
//                 }}>
//                   <ArrowForwardIosIcon />
//                 </div>
//                 <div className="player-controls" onClick={toggleNormalMode}>
//                   <RepeatIcon />
//                 </div>
//               </div>
//             </div>
//           );
//         }


import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { play, pause, stop, setTrack, setCurrentTime, setVolume, setDuration } from '../Redux/playerSlice';

const Player = () => {
    const dispatch = useDispatch();
    const playerState = useSelector((state) => state.player);
    const { isPlaying, track, currentTime, duration, volume } = playerState;
    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const sourceRef = useRef(null);
    const gainNodeRef = useRef(null);

    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (track.url) {
            console.log('Fetching track:', track.url);
            fetch(track.url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.arrayBuffer();
                })
                .then(arrayBuffer => {
                    console.log('Decoding audio data');
                    return audioContextRef.current.decodeAudioData(arrayBuffer);
                })
                .then(audioBuffer => {
                    console.log('Audio data decoded');
                    audioBufferRef.current = audioBuffer;
                    dispatch(setDuration(audioBuffer.duration));
                })
                .catch(error => {
                    console.error('Error with audio decoding:', error);
                });
        }
    }, [track, dispatch]);

    useEffect(() => {
        if (isPlaying && audioBufferRef.current) {
            console.log('Starting playback');
            if (sourceRef.current) {
                sourceRef.current.stop();
            }
            sourceRef.current = audioContextRef.current.createBufferSource();
            sourceRef.current.buffer = audioBufferRef.current;
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.gain.value = volume;
            sourceRef.current.connect(gainNodeRef.current).connect(audioContextRef.current.destination);
            sourceRef.current.start(0, currentTime);
            sourceRef.current.onended = () => {
                dispatch(stop());
            };
        } else if (!isPlaying && sourceRef.current) {
            console.log('Stopping playback');
            sourceRef.current.stop();
            sourceRef.current = null;
        }
    }, [isPlaying, currentTime, volume, dispatch]);

    const handlePlayPause = () => {
        if (isPlaying) {
            dispatch(pause());
        } else {
            dispatch(play());
        }
    };

    const handleStop = () => {
        dispatch(stop());
    };

    const handleTrackChange = (index) => {
        dispatch(setTrack(index));
    };

    const handleTimeChange = (e) => {
        dispatch(setCurrentTime(Number(e.target.value)));
    };

    const handleVolumeChange = (e) => {
        dispatch(setVolume(Number(e.target.value)));
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = Number(e.target.value);
        }
    };

    return (
        <div>
            <h1>Now Playing: {track.name} by {track.artist}</h1>
            <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button onClick={handleStop}>Stop</button>
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleTimeChange}
            />
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
            />
        </div>
    );
};

export default Player;
