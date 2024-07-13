import React from 'react';
import PlayerControls from './components/PlayerControls';
import Playlist from './components/Playlist';
import { useDispatch } from 'react-redux';
import { setAudioPlaylist } from './Redux/playerSlice';

const App = () => {
    const dispatch = useDispatch();

    // Пример плейлиста
    const samplePlaylist = {
        tracks: []
    };

    React.useEffect(() => {
        dispatch(setAudioPlaylist(samplePlaylist));
    }, [dispatch]);

    return (
        <div className="app">
            <h1>Music Player</h1>
            <PlayerControls />
            <Playlist />
        </div>
    );
};

export default App;
