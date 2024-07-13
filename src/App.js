import React from 'react';
import PlayerControls from './components/PlayerControls';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioPlaylist } from './Redux/playerSlice';
import './App.css';
import Menu from './components/Menu';
import Song from './components/Song';

const App = () => {
    const dispatch = useDispatch();
    const playlist = useSelector(state => state.player.playlist);

    const samplePlaylist = {
        tracks: []
    };

    React.useEffect(() => {
        dispatch(setAudioPlaylist(samplePlaylist));
    }, [dispatch]);

    return (
        <div className="home">
            <div className="sidebar-wrapper-left">
                <aside className="sidebar-left">
                    <div className="logo-container">
                        <img src="../logo.png" alt="Logo"></img>
                        <p>Bits</p>
                    </div>
                    <div>
                        <Menu />
                    </div>
                </aside>
            </div>
            <main className="main-container">
                <div className="hero-container">
                    <div className="input-container">
                        <input
                            className="search-input"
                            type="search"
                            placeholder="Search..."
                        />
                    </div>
                    <div className="playlist">
                        {playlist.tracks.map((track, index) => (
                            <Song key={track._id} id={track._id} title={track.name} artist={track.artist} />
                        ))}
                    </div>
                </div>
            </main>
            <div className="sidebar-wrapper-right">
                <aside className="sidebar-right">
                    <div className="log-in-container">
                    </div>
                    <div className="app">
                        <h1>Music Player</h1>
                        <PlayerControls />
                    </div>
                    <div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default App;
