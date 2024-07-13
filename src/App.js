import React, { useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
import UploadTrack from './components/UploadTrack';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaylist, setTrack, play, pause, stop, nextTrack, prevTrack } from './Redux/playerSlice';

const App = () => {
    const dispatch = useDispatch();
    const playlist = useSelector((state) => state.player.playlist);
    const track = useSelector((state) => state.player.track);

    const samplePlaylist = {
        _id: '1',
        name: 'Sample Playlist',
        tracks: [],
    };

    useEffect(() => {
        dispatch(setPlaylist(samplePlaylist));
    }, [dispatch]);

    const handlePlay = () => {
        if (track.url) {
            dispatch(play());
        } else if (playlist.tracks.length > 0) {
            dispatch(setTrack(playlist.tracks[0]));
            dispatch(play());
        }
    };

    const handlePause = () => {
        dispatch(pause());
    };

    const handleStop = () => {
        dispatch(stop());
    };

    const handleNextTrack = () => {
        dispatch(nextTrack());
    };

    const handlePrevTrack = () => {
        dispatch(prevTrack());
    };

    return (
        <div>
            <h1>Music Player</h1>
            <AudioPlayer />
            <button onClick={handlePlay}>Play</button>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleNextTrack}>Next</button>
            <button onClick={handlePrevTrack}>Prev</button>
            <UploadTrack />
        </div>
    );
};

export default App;