import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";
import { addSongToPlaylist, removeSongFromPlaylist } from "../Redux/reducer/list";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function Song(props) {
    const song = useSelector(state => state.song.value);
    const selectedPlaylist = useSelector(state => state.list.value);
    const dispatch = useDispatch();

    const handleAddSong = (e) => {
        e.stopPropagation();
        dispatch(addSongToPlaylist({ playlistId: selectedPlaylist.id, song: props }));
    };

    const handleRemoveSong = (e) => {
        e.stopPropagation();
        dispatch(removeSongFromPlaylist({ playlistId: selectedPlaylist.id, songId: props.id }));
    };

    return (
        <div className="song" onClick={() => {
            dispatch(changeSong(props));
            setTimeout(() => {
                if (song?.id !== props.id) {
                    const player = document.getElementById("audio");
                    player.load();
                    player.play();
                }
            })
        }}>
            <div className="song-container">
                <img className="audio-img" alt={props.title} src={props.artwork} />
                <div className="name-song-container">
                    <div className="song-title">{props.title}</div>
                    {props.id === song?.id}
                    <div className="song-artist">{props.artist}</div>
                </div>
                <AddIcon onClick={handleAddSong} />
                <CloseIcon onClick={handleRemoveSong} />
            </div>
        </div>
    );
}
