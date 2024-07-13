import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioTrack } from '../Redux/playerSlice';

const Playlist = () => {
    const dispatch = useDispatch();
    const playlist = useSelector(state => state.player.playlist.tracks);

    const handleTrackSelect = (index) => {
        dispatch(setAudioTrack(index));
    };

    return (
        <div>
            {playlist.map((track, index) => (
                <div key={track._id} onClick={() => handleTrackSelect(index)}>
                    {track.name}
                </div>
            ))}
        </div>
    );
};

export default Playlist;
