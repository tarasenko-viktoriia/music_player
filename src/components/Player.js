import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Player() {
    const currentSong = useSelector(state => state.song.currentSong);
    const songsList = useSelector(state => state.song.songsList);
    const audioRef = useRef(null);
    const [songTitle, setSongTitle] = useState("");
    const [playbackMode, setPlaybackMode] = useState("normal"); // Доданий стан для режиму відтворення
    const [shuffleList, setShuffleList] = useState([]);
    const [shuffleIndex, setShuffleIndex] = useState(0);

    const dispatch = useDispatch();

    const index = songsList.findIndex((item) => item.id === currentSong?.id);

    const isPrev = () => (playbackMode === "shuffle" ? shuffleIndex > 0 : index > 0) && songsList.length > 1;
    const isNext = () => songsList.length > 1;

    useEffect(() => {
        const player = audioRef.current;

        const handleCanPlay = () => {
            setSongTitle(currentSong?.title); // Оновлення назви пісні після завантаження
        };

        const handleEnded = () => {
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

        player.addEventListener('canplay', handleCanPlay);
        player.addEventListener('ended', handleEnded);

        return () => {
            player.removeEventListener('canplay', handleCanPlay);
            player.removeEventListener('ended', handleEnded);
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
        }, 100); // Додатковий інтервал для впевненості, що плеєр готовий до відтворення
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
                <img src={currentSong?.artwork} alt={currentSong?.title}
                    height="50"
                    width="50"
                    style={{ borderRadius: "15px", marginRight: 10 }} />
                <div className="name">{songTitle}</div> {/* Відображення назви пісні */}
                <div className="player-controls" onClick={togglePlaybackMode}>
                    {playbackMode === "normal" && (
                        <span>Normal</span>
                    )}
                    {playbackMode === "shuffle" && (
                        <span>Shuffle</span>
                    )}
                    {playbackMode === "repeat" && (
                        <span>Repeat</span>
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
