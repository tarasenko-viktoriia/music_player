import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Menu from "./components/Menu";
import Song from "./components/Song";
import Playlist from "./components/Playlist";
import Player from "./components/Player";
import LoginDialog from "./components/LoginDialog";
import SignupDialog from "./components/SignupDialog";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { addSong, changeSong } from "./Redux/reducer/song"; 
import Login from "./Login";
import { setAudioPlaylist, addTrackToPlaylist } from './Redux/playerSlice';

import { useDropzone } from 'react-dropzone';

export default function Home() {
    const song = useSelector((state) => state.player.currentTrack); 
    const songsList = useSelector(state => state.player.playlist.tracks);
    const [isSongs, setIsSongs] = useState(true);
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

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const url = URL.createObjectURL(file);
            const newTrack = {
                _id: new Date().getTime().toString(),
                url: url,
                name: file.name
            };
            dispatch(addTrackToPlaylist(newTrack));
            dispatch(setAudioPlaylist({
                tracks: [...songsList, newTrack]
            }));
        });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
                                {songsList.map(item => (
                                        <div key={item.id} onClick={() => dispatch(changeSong(item))}>
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
                    <div className="app">
                        <h1>Music Player</h1>
                        <Player />
                    </div>
                    <div {...getRootProps({ className: 'dropzone' })} style={{ width: '100%', height: '100px', border: '2px dashed #ccc', borderRadius: '5px', textAlign: 'center', paddingTop: '30px', cursor: 'pointer' }}>
                        <input {...getInputProps()} />
                        <p>Перетягніть файли сюди або клікніть для вибору файлів</p>
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