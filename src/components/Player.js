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

    const dispatch = useDispatch();

    const index = songsList.findIndex((item) => item.id === currentSong?.id);

    const isPrev = () => index > 0 && songsList.length > 1;
    const isNext = () => index < songsList.length - 1 && songsList.length > 1;

    useEffect(() => {
        const player = audioRef.current;

        const handleCanPlay = () => {
            setSongTitle(currentSong?.title); // Оновлення назви пісні після завантаження
        };

        player.addEventListener('canplay', handleCanPlay);

        return () => {
            player.removeEventListener('canplay', handleCanPlay);
        };
    }, [currentSong]);

    const changeAndPlaySong = (newSong) => {
        const player = audioRef.current;

        dispatch(changeSong(newSong));

        // Відтворення пісні після зміни
        setTimeout(() => {
            if (!player.paused) {
                player.pause();
            }
            player.load();
            player.play();
        }, 100); // Додатковий інтервал для впевненості, що плеєр готовий до відтворення
    };

    return (
        <div className="player">
            <div>
                <img src={currentSong?.artwork} alt={currentSong?.title}
                    height="50"
                    width="50"
                    style={{ borderRadius: "15px", marginRight: 10 }} />
                <div className="name">{songTitle}</div> {/* Відображення назви пісні */}
                <div className={`player-controls ${!isPrev() && "cursor-disabled"}`} onClick={() => {
                    if (isPrev()) {
                        changeAndPlaySong(songsList[index - 1]);
                    }
                }}>
                    <ArrowBackIosIcon />
                </div>
                <audio ref={audioRef} id="audio" controls>
                    <source src={currentSong?.file} type="audio/mpeg" />
                </audio>
                <div className={`player-controls ${!isNext() && "cursor-disabled"}`} onClick={() => {
                    if (isNext()) {
                        changeAndPlaySong(songsList[index + 1]);
                    }
                }}>
                    <ArrowForwardIosIcon />
                </div>
            </div>
        </div>
    );
}
