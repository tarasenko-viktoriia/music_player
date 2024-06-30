import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {PlayList} from "../data"
import {changeList} from "../Redux/reducer/list"
import Song from "./Song";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function Playlist({search}) {
    const [isPlaylist, setIsPlaylist] = useState (true);
    const [playList, setPlayList] = useState ({});
    const list = useSelector(state => state.list.value);
    const dispatch = useDispatch ();
    return (
        <div > 
        {isPlaylist
            ? PlayList.filter(data => data.title.toLowerCase().includes(search.toLocaleLowerCase())).map((item) => (
            <div className="song text-center" onClick={()=> {
                setPlayList(item);
                setIsPlaylist (false);
                dispatch(changeList(item.songs));
                }}>
                <img className="audio-img" alt={item.title} src={item.imgUrl}/>
                <div>{item.title}</div>
            </div>))
        : (
        <div>
            <div className="playlist-header">
                {playList.title}
            </div>
            <div>
                {list.filter(data => data.title.toLowerCase().includes(search.toLocaleLowerCase())).map((item) => (
                    <Song {...item}></Song>
                ))}
            </div>
            </div>)}
        </div>
    );
}