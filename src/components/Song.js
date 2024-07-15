import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";

export default function Song(props){
    const song = useSelector (state => state.song.value);
    const dispatch = useDispatch();
    return (
        <div className="song text-center" onClick={() => {
            dispatch(changeSong(props));
            setTimeout(() => {
                if(song?.id !==props.id) {
                    const player = document.getElementById("audio");
                    player.load();
                    player.play();
                }
            })
        }}>
            <img className="audio-img" alt={props.title} src={props.artwork}/>
            <div>{props.title}</div>
            {props.id === song?.id}
            <div>Artist: {props.artist}</div>
        </div>
    )
}