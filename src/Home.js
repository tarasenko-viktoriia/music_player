import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import { useSelector, useDispatch } from "react-redux";
import Menu from "./components/Menu";
import Song from "./components/Song";
import Playlist from "./components/Playlist";
import Player from "./components/Player";
import Basic from "./components/Basic";
import LoginDialog from "./components/LoginDialog";
import SignupDialog from "./components/SignupDialog";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { addSong, changeSong } from "./Redux/reducer/song"; 

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

    const handleAddSongOpen = () => {
        setAddSongOpen(true);
    };

    const handleAddSongClose = () => {
        setAddSongOpen(false);
    };

    const handleAddSong = () => {
        if (newSongFile) {
            const newSong = {
                id: songsList.length + 1, // Зазвичай потрібно генерувати унікальний ID
                title: newSongTitle || newSongFile.name, // Використовуємо ім'я файлу, якщо не вказана власна назва
                file: URL.createObjectURL(newSongFile), // Створюємо URL для файлу
            };
            dispatch(addSong(newSong)); // Додаємо пісню до Redux
            dispatch(changeSong(newSong)); // Змінюємо поточну пісню для програвання
            setAddSongOpen(false);
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
                    <button onClick={handleAddSongOpen}>Додати пісню</button>
                    {isSongs ? (
                        <div className="songs">
                            {songsList.filter((data) =>
                                data.title.toLowerCase().includes(search.toLowerCase())
                            ).map((item) => (
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

            <Dialog open={addSongOpen} onClose={handleAddSongClose}>
                <DialogTitle>Додати нову пісню</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Назва пісні"
                        type="text"
                        fullWidth
                        value={newSongTitle}
                        onChange={(e) => setNewSongTitle(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setNewSongFile(e.target.files[0])}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddSongClose} color="primary">
                        Відміна
                    </Button>
                    <Button onClick={handleAddSong} color="primary">
                        Додати
                    </Button>
                </DialogActions>
            </Dialog>
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
