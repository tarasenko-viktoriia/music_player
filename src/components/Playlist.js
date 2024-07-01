import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayList } from "../data";
import { changeList } from "../Redux/reducer/list";
import Song from "./Song";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function Playlist({ search }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const list = useSelector(state => state.list.value);
    const dispatch = useDispatch();

    const handlePlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist);
        dispatch(changeList(playlist.songs));
    };

    return (
        <div>
            {selectedPlaylist ? (
                <div>
                    <ArrowBackIosIcon onClick={() => setSelectedPlaylist(null)} />
                    <div>
                        {selectedPlaylist.songs
                            .filter(song => song.title.toLowerCase().includes(search.toLowerCase()))
                            .map(song => (
                                <Song key={song.id} {...song} />
                            ))}
                    </div>
                </div>
            ) : (
                <div className="playlist-container">
                    {PlayList.filter(playlist =>
                        playlist.title.toLowerCase().includes(search.toLowerCase())
                    ).map(playlist => (
                        <div key={playlist.id} className="playlist-items" onClick={() => handlePlaylistClick(playlist)}>
                            <img className="audio-img" alt={playlist.title} src={playlist.imgUrl} />
                            <div>{playlist.title}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
