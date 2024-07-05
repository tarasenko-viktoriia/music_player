import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Player() {
    const song = useSelector(state => state.song.value);
    const list = useSelector(state => state.list.value);
    const audioRef = useRef(null);

    const dispatch = useDispatch();

    const index = list.findIndex((item) => item.id === song.id);

    const isPrev = () => index > 0 && list.length > 1;

    const isNext = () => index < list.length - 1 && list.length > 1;

    useEffect(() => {
        const player = audioRef.current;

        const handleCanPlay = () => {
            player.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        };

        player.addEventListener('canplay', handleCanPlay);

        return () => {
            player.removeEventListener('canplay', handleCanPlay);
        };
    }, [song]);

    const changeAndPlaySong = (newSong) => {
        const player = audioRef.current;

        if (!player.paused) {
            player.pause();
        }

        dispatch(changeSong(newSong));
    };

    useEffect(() => {
        const player = audioRef.current;
        player.load();
    }, [song]);

    return (
        <div className="player">
            <div>
                <img src={song.artwork} alt={song.title}
                    height="50"
                    width="50"
                    style={{ borderRadius: "15px", marginRight: 10 }} />
                <div className="name">{song.title}</div>
                <div className={`player-controls ${!isPrev() && "cursor-disabled"}`} onClick={() => {
                    if (isPrev()) {
                        changeAndPlaySong(list[index - 1]);
                    }
                }}>
                    <ArrowBackIosIcon />
                </div>
                <audio ref={audioRef} id="audio" controls>
                    <source src={song.url} type="audio/mpeg" />
                </audio>
                <div className={`player-controls ${!isNext() && "cursor-disabled"}`} onClick={() => {
                    if (isNext()) {
                        changeAndPlaySong(list[index + 1]);
                    }
                }}>
                    <ArrowForwardIosIcon />
                </div>
            </div>
        </div>
    );
}
