import React from 'react';
import PlayerControls from './components/PlayerControls';
import Playlist from './components/Playlist';
import { useDispatch } from 'react-redux';
import { setAudioPlaylist } from './Redux/playerSlice';
import './App.css';
// import Menu from './components/Menu';

const App = () => {
    const dispatch = useDispatch();

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
                        {/* <Menu /> */}
                    </div>
                </aside>
            </div>
            <main className="main-container">
                <div className="hero-container">
                    <div className="input-container">
                        <input
                            // className="search-input"
                            // type="search"
                            // placeholder="Search..."
                            // value={search}
                            // onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* {isSongs ? (
                        <div className="songs">
                            {songsList
                                .filter(data =>
                                    data.title.toLowerCase().includes(search.toLowerCase())
                                )
                                .map(item => (
                                    <div key={item.id} onClick={() => dispatch(changeSong(item, false))}>
                                        <Song {...item} />
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <Playlist search={search} />
                    )} */}
                </div>
            </main>
            <div className="sidebar-wrapper-right">
                <aside className="sidebar-right">
                    <div className="log-in-container">
                        {/* <Login/> */}
                    </div>
                    <div className="app">
                        <h1>Music Player</h1>
                        <PlayerControls />
                        <Playlist />
                    </div>
                    <div>
                        {/* <Basic onFilesSelected={handleAddSong} /> */}
                    </div>
                </aside>
            </div>
            {/* <LoginDialog
                open={loginOpen}
                handleClose={handleLoginClose}
                handleSignupOpen={handleSignupOpen}
            />
            <SignupDialog open={signupOpen} handleClose={handleSignupClose} /> */}
        </div>
    );
};

export default App;
