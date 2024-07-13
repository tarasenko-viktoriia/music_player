import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pauseAudio, playAudio } from '../Redux/playerSlice';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const Song = ({ id, title, artist }) => {
    const dispatch = useDispatch();
    const isPlaying = useSelector(state => state.player.isPlaying);

    const handlePause = () => {
        dispatch(pauseAudio());
    };

    const handlePlay = () => {
        dispatch(playAudio());
    };

    return (
        <div className="song">
            <div className="song-container">
                <div className="name-song-container">
                    <div className="play-pause-button">
                        {isPlaying ? (
                            <PauseIcon onClick={handlePause} />
                        ) : (
                            <PlayArrowIcon onClick={handlePlay}/>
                        )}
                    </div>
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
