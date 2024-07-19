import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Menu from "./components/Menu";
import Song from "./components/Song";
import Playlist from "./components/Playlist";
import Player from "./components/Player";
import Basic from "./components/Basic";
import LoginDialog from "./components/LoginDialog";
import SignupDialog from "./components/SignupDialog";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { addSong, changeSong } from "./Redux/reducer/song"; 
import Login from "./Login";

export default function Home() {
    const [isSongs, setIsSongs] = useState(true);
    const song = useSelector((state) => state.song.currentSong);
    const songsList = useSelector((state) => state.song.songsList);
    const [search, setSearch] = useState("");
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [addSongOpen, setAddSongOpen] = useState(false);
    const [newSongTitle, setNewSongTitle] = useState("");
    const [newSongFile, setNewSongFile] = useState(null);
    const dispatch = useDispatch();

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

    const handleAddSong = (newSongFile) => {
        if (newSongFile) {
            const newSong = {
                id: songsList.length + 1,
                title: newSongTitle || newSongFile.name,
                file: URL.createObjectURL(newSongFile),
            };
            dispatch(addSong(newSong));
            dispatch(changeSong(newSong, false));
            setNewSongTitle("");
            setNewSongFile(null);
        }
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
                        <Router>
                            <Menu isSongs={isSongs} setIsSongs={setIsSongs} />
                        </Router>
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
                    )}
                </div>
            </main>
            <div className="sidebar-wrapper-right">
                <aside className="sidebar-right">
                    <div className="log-in-container">
                        <Login/>
                    </div>
                    {song && <Player />}
                    <div>
                        <Basic onFilesSelected={handleAddSong} />
                    </div>
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
