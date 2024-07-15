import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function Player() {
    const currentSong = useSelector(state => state.song.currentSong);
    const songsList = useSelector(state => state.song.songsList);
    const audioRef = useRef(null);
    const [songTitle, setSongTitle] = useState("");
    const [playbackMode, setPlaybackMode] = useState("normal"); 
    const [isPlaying, setIsPlaying] = useState(false); 
    const [shuffleList, setShuffleList] = useState([]);
    const [shuffleIndex, setShuffleIndex] = useState(0);

    const dispatch = useDispatch();

    const index = songsList.findIndex((item) => item.id === currentSong?.id);

    const isPrev = () => (playbackMode === "shuffle" ? shuffleIndex > 0 : index > 0) && songsList.length > 1;
    const isNext = () => songsList.length > 1;

    useEffect(() => {
        const player = audioRef.current;

        const handleCanPlay = () => {
            setSongTitle(currentSong?.title); 
        };

        const handleEnded = () => {
            setIsPlaying(false);
            if (playbackMode === "normal") {
                if (index < songsList.length - 1) {
                    changeAndPlaySong(songsList[index + 1]);
                } else {
                    changeAndPlaySong(songsList[0]);
                }
            } else if (playbackMode === "shuffle") {
                if (shuffleIndex < shuffleList.length - 1) {
                    setShuffleIndex(shuffleIndex + 1);
                    changeAndPlaySong(shuffleList[shuffleIndex + 1]);
                } else {
                    const newShuffleList = shuffleArray([...songsList]);
                    setShuffleList(newShuffleList);
                    setShuffleIndex(0);
                    changeAndPlaySong(newShuffleList[0]);
                }
            } else if (playbackMode === "repeat") {
                changeAndPlaySong(currentSong);
            }
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        player.addEventListener('canplay', handleCanPlay);
        player.addEventListener('ended', handleEnded);
        player.addEventListener('play', handlePlay);
        player.addEventListener('pause', handlePause);

        return () => {
            player.removeEventListener('canplay', handleCanPlay);
            player.removeEventListener('ended', handleEnded);
            player.removeEventListener('play', handlePlay);
            player.removeEventListener('pause', handlePause);
        };
    }, [currentSong, playbackMode, shuffleIndex, shuffleList, index]);

    useEffect(() => {
        if (playbackMode === "shuffle") {
            const newShuffleList = shuffleArray([...songsList]);
            setShuffleList(newShuffleList);
            setShuffleIndex(0);
        }
    }, [playbackMode, songsList]);

    const changeAndPlaySong = (newSong) => {
        const player = audioRef.current;

        dispatch(changeSong(newSong));

        setTimeout(() => {
            if (!player.paused) {
                player.pause();
            }
            player.load();
            player.play();
        }, 100); 
    };

    const togglePlaybackMode = () => {
        switch (playbackMode) {
            case "normal":
                setPlaybackMode("shuffle");
                break;
            case "shuffle":
                setPlaybackMode("repeat");
                break;
            case "repeat":
                setPlaybackMode("normal");
                break;
            default:
                break;
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <div className="player">
            <div>
            <div className={`equalizer ${isPlaying ? 'playing' : ''}`}>
                    <div className="bar bar1"></div>
                    <div className="bar bar2"></div>
                    <div className="bar bar3"></div>
                    <div className="bar bar4"></div>
                    <div className="bar bar5"></div>
                </div>
                <div className="name">{songTitle}</div> 
                <div className="player-controls" onClick={togglePlaybackMode}>
                    {playbackMode === "normal" && (
                        <RepeatIcon  />
                    )}
                    {playbackMode === "shuffle" && (
                        <ShuffleIcon />
                    )}
                    {playbackMode === "repeat" && (
                        <RestartAltIcon/>
                    )}
                </div>
                <div className={`player-controls ${!isPrev() && "cursor-disabled"}`} onClick={() => {
                    if (isPrev()) {
                        if (playbackMode === "shuffle") {
                            setShuffleIndex(shuffleIndex - 1);
                            changeAndPlaySong(shuffleList[shuffleIndex - 1]);
                        } else {
                            changeAndPlaySong(songsList[index - 1]);
                        }
                    }
                }}>
                    <ArrowBackIosIcon />
                </div>
                <audio ref={audioRef} id="audio" controls>
                    <source src={currentSong?.file} type="audio/mpeg" />
                </audio>
                <div className={`player-controls ${!isNext() && "cursor-disabled"}`} onClick={() => {
                    if (isNext()) {
                        if (playbackMode === "shuffle") {
                            if (shuffleIndex < shuffleList.length - 1) {
                                setShuffleIndex(shuffleIndex + 1);
                                changeAndPlaySong(shuffleList[shuffleIndex + 1]);
                            } else {
                                const newShuffleList = shuffleArray([...songsList]);
                                setShuffleList(newShuffleList);
                                setShuffleIndex(0);
                                changeAndPlaySong(newShuffleList[0]);
                            }
                        } else {
                            if (index < songsList.length - 1) {
                                changeAndPlaySong(songsList[index + 1]);
                            } else {
                                changeAndPlaySong(songsList[0]);
                            }
                        }
                    }
                }}>
                    <ArrowForwardIosIcon />
                </div>
            </div>
        </div>
    );
}
