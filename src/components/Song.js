import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioTrack, play } from '../Redux/playerSlice';

const Song = ({ id, title, artist }) => {
    const dispatch = useDispatch();
    const playlist = useSelector(state => state.player.playlist);

    const handleSongClick = () => {
        const trackIndex = playlist.tracks.findIndex(track => track._id === id);
        if (trackIndex !== -1) {
            dispatch(setAudioTrack(trackIndex));
            dispatch(play());
        }
    };

    return (
        <div className="song" onClick={handleSongClick}>
            <div className="song-container">
                <div className="name-song-container">
                    <div className="song-info">
                        <div className="song-title">{title}</div>
                        <div className="song-artist">{artist}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Song;
