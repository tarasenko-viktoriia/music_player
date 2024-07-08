// Home.js
import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import { useSelector } from "react-redux";
import Menu from "./components/Menu";
import { MusicList } from "./data";
import Song from "./components/Song";
import Playlist from "./components/Playlist";
import Player from "./components/Player";
import Basic from "./components/Basic";
import LoginDialog from "./components/LoginDialog";
import SignupDialog from "./components/SignupDialog";

export default function Home() {
    const [isSongs, setIsSongs] = useState(true);
    const song = useSelector((state) => state.song.value);
    const [search, setSearch] = useState("");
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);

    const handleLoginOpen = () => {
        setLoginOpen(true);
    };

    const handleLoginClose = () => {
        setLoginOpen(false);
    };

    const handleSignupOpen = () => {
        setSignupOpen(true);
    };

    const handleSignupClose = () => {
        setSignupOpen(false);
    };

    return (
        <div className="home">
            <div className="sidebar-wrapper-left">
                <aside className="sidebar-left">
                    <div className="logo-container">
                        <img src="../logo.png" alt="Logo"></img>
                        <p>Bits</p>
                    </div>
                    <div>
                        <Menu isSongs={isSongs} setIsSongs={setIsSongs} />
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {isSongs ? (
                        <div className="songs">
                            {MusicList.filter((data) =>
                                data.title.toLowerCase().includes(search.toLowerCase())
                            ).map((item) => (
                                <Song key={item.id} {...item} />
                            ))}
                        </div>
                    ) : (
                        <Playlist search={search} />
                    )}
                </div>
            </main>
            <div className="sidebar-wrapper-right">
                <aside className="sidebar-right">
                    <div className="log-in-container">
                        <p>To use all Bits functions, login into your account</p>
                        <button onClick={handleLoginOpen}>Log in</button>
                    </div>
                    {song && <Player />}
                    <Basic />
                </aside>
            </div>
            <LoginDialog
                open={loginOpen}
                handleClose={handleLoginClose}
                handleSignupOpen={handleSignupOpen}
            />
            <SignupDialog open={signupOpen} handleClose={handleSignupClose} />
        </div>
    );
}

function App() {
    return (
        <Router history={createHistory()}>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/playlist" component={Playlist} />
                <Route path="/song/:id" component={Song} />
            </Switch>
        </Router>
    );
}
