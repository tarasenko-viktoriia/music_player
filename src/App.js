import React from 'react';
import PlayerControls from './components/PlayerControls';
import Playlist from './components/Playlist';
import { useDispatch } from 'react-redux';
import { setAudioPlaylist } from './Redux/playerSlice';

const App = () => {
    const dispatch = useDispatch();

    // Пример плейлиста
    const samplePlaylist = {
        _id: '1',
        name: 'My Playlist',
        tracks: [
            { _id: '1', url: 'path/to/song1.mp3', name: 'Song 1' },
            { _id: '2', url: 'path/to/song2.mp3', name: 'Song 2' },
            { _id: '3', url: 'path/to/song3.mp3', name: 'Song 3' }
        ]
    };

    // Установим плейлист при загрузке компонента
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
