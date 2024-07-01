import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";

export default function Song(props){
    const song= useSelector (state => state.song.value);
    const dispatch = useDispatch();
    return (
        <div className="song" onClick={()=>{
            dispatch(changeSong(props));
            setTimeout(()=> {
                if(song?.id !==props.id) {
                    const player = document.getElementById("audio");
                    player.load();
                    player.play();
                }
            })
        }}>
            <div className="song-container">
                <img className="audio-img" alt={props.title} src={props.artwork}/>
                <div className="name-song-container">
                    <div className="song-title">{props.title}</div>
                    {props.id === song?.id}
                    <div className="song-artist">{props.artist}</div>
                </div>
            </div>
        </div>
    )
}