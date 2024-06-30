import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Player (){
    const song = useSelector (state => state.song.value);
    const list = useSelector(state => state.list.value)

    const dispatch = useDispatch();

    const index = list.findIndex((item) => item.id === song.id);

    const isPrev = () => index > 0 && list.length > 1;

    const isNext = () => index < list.length-1 && list.length >1;

    const reloadMusic =() => {
        const player = document.getElementById("audio");
        player.load();
        player.play();
    }
    return (
        <div className="player">
            <div>
                <img src={song.artwork} alt={song.title}
                height="50"
                width="50"
                style={{borderRadius: "15px", marginRight:10}}/>
                <div className="name">{song.title}</div>
                <div className={`player-controls ${!isPrev() && "cursor-disabled"}`} onClick={() =>{
                    if(isPrev()){
                        dispatch(changeSong(list[index-1]))
                        reloadMusic();
                    }
                }}>
                    <ArrowBackIosIcon/>
                </div>
                <audio id="audio" controls>
                    <source src={song.url} type="audio/mpeg"/>
                </audio>
                <div className={`player-controls ${!isNext() && "cursor-disabled"}`} onClick={() =>{
                    if(isNext()){
                        dispatch(changeSong(list[index+1]))
                        reloadMusic();
                    }
                }}>
                    <ArrowForwardIosIcon/>
                </div>
            </div>
        </div>
    )
}