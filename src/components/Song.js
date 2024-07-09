import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";
import { addSongToPlaylist, removeSongFromPlaylist } from "../Redux/reducer/list";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, TextField } from '@mui/material';
import { addPlaylist } from "../Redux/reducer/list";

const defaultPlaylistImage = '../image/default-img.jpg'; // Замініть на URL вашого зображення за замовчуванням

export default function Song(props) {
    const song = useSelector(state => state.song.value);
    const playlists = useSelector(state => state.list.playlists); // Припускаючи, що ви маєте плейлисти в стані Redux
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
    const [newPlaylistImage, setNewPlaylistImage] = useState(null);

    const handleAddSong = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setNewPlaylistOpen(false); // Закрити діалог створення нового плейлисту, якщо він відкритий
        setNewPlaylistTitle(""); // Скидання назви нового плейлисту
        setNewPlaylistImage(null); // Скидання зображення нового плейлисту
    };

    const handlePlaylistChange = (e) => {
        const selected = e.target.value;
        setSelectedPlaylist(selected);

        // Якщо вибрано "new", відкрийте діалог створення нового плейлисту
        if (selected === "new") {
            setNewPlaylistOpen(true);
            setNewPlaylistImage(defaultPlaylistImage); // Встановлення зображення за замовчуванням при відкритті діалогу створення нового плейлисту
        }
    };

    const handleAddSongToPlaylist = () => {
        dispatch(addSongToPlaylist({ playlistId: selectedPlaylist, song: props }));
        setOpen(false);
    };

    const handleRemoveSong = (e) => {
        e.stopPropagation();
        playlists.forEach(playlist => {
            const songIndex = playlist.songs.findIndex(song => song.id === props.id);
            if (songIndex !== -1) {
                dispatch(removeSongFromPlaylist({ playlistId: playlist.id, songId: props.id }));
            }
        });
    };

    const handleAddNewPlaylist = () => {
        const newPlaylist = {
            id: playlists.length + 1,
            title: newPlaylistTitle,
            imgUrl: newPlaylistImage || defaultPlaylistImage, // Використання зображення за замовчуванням, якщо не вибрано зображення
            songs: [] // Порожній масив для пісень нового плейлисту
        };
        dispatch(addPlaylist(newPlaylist));
        setSelectedPlaylist(newPlaylist.id); // Вибрати новостворений плейлист
        setNewPlaylistOpen(false);
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewPlaylistImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleChangeSong = () => {
        dispatch(changeSong(props)); // Змінюємо поточну пісню
        const player = document.getElementById("audio");
        player.load(); // Завантажуємо пісню
        player.play(); // Відтворюємо пісню
    };

    return (
        <div className="song" onClick={handleChangeSong}>
            <div className="song-container">
                <div className="name-song-container">
                    <div className="song-title">{props.title}</div>
                    <div className="song-artist">{props.artist}</div>
                </div>
                <AddIcon onClick={handleAddSong} />
                <CloseIcon onClick={handleRemoveSong} />
            </div>

            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Виберіть плейлист</DialogTitle>
                <DialogContent>
                    <Select
                        value={selectedPlaylist}
                        onChange={handlePlaylistChange}
                        fullWidth
                    >
                        {playlists.map(playlist => (
                            <MenuItem key={playlist.id} value={playlist.id}>
                                {playlist.title}
                            </MenuItem>
                        ))}
                        <MenuItem value="new">Створити новий плейлист</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Скасувати</Button>
                    <Button onClick={handleAddSongToPlaylist} color="primary" disabled={!selectedPlaylist}>
                        Додати
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={newPlaylistOpen} onClose={handleDialogClose}>
                <DialogTitle>Новий плейлист</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Назва плейлисту"
                        value={newPlaylistTitle}
                        onChange={(e) => setNewPlaylistTitle(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2 }}
                    >
                        Завантажити зображення
                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                    {newPlaylistImage && (
                        <img src={newPlaylistImage} alt="Playlist" style={{ marginTop: '10px', width: '100%' }} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Скасувати</Button>
                    <Button onClick={handleAddNewPlaylist} variant="contained" color="primary" disabled={!newPlaylistTitle}>
                        Додати
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
