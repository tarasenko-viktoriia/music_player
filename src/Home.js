
import React, {useState} from "react";
import Menu from "./components/Menu"
import {MusicList, PlayList} from "./data";
import Song from "./components/Song";
import Playlist from "./components/Playlist";
import { useSelector } from "react-redux";
import Player from "./components/Player";

export default function Home(){
    const [isSongs, setIsSongs] = useState(true);
    const song = useSelector (state => state.song.value);
    const [search, setSearch] = useState("");
    return (
        <div className="home">
            <h3 className="header text-center">Bits</h3>
            <div className="main-container">
                <div className="d-flex justify-content-center input-container">
                    <input 
                        type="search" 
                        id="search-input" 
                        className="form-control" 
                        placeholder="Searh"
                        value = {search}
                        onChange={(e) => setSearch(e.target.value)}
                    >
                    </input>
                </div>
                <div className="d-flex content">
                    <Menu isSongs={isSongs} setIsSongs={setIsSongs}/>
                    <div style={{flex: 1}}>
                    { isSongs ? (
                            <div className="d-flex flex-wrap songs">
                                {
                                    MusicList.filter(data => data.title.toLowerCase().includes(search.toLocaleLowerCase())).map((item) => (<Song {...item}/> ))
                                }
                            </div> 
                    ) : (
                    <Playlist search={search}/>)}
                    </div>  
                </div>
            </div>
            {song && <Player/>}
        </div>
    )
};
