import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong } from "../Redux/reducer/song";
import { addSongToPlaylist, removeSongFromPlaylist } from "../Redux/reducer/list";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, TextField } from '@mui/material';
import { addPlaylist } from "../Redux/reducer/list";

const defaultPlaylistImage = '../image/default-img.jpg' // Replace with your default image URL

export default function Song(props) {
    const song = useSelector(state => state.song.value);
    const playlists = useSelector(state => state.list.playlists); // Assuming you have playlists in the state
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
        setNewPlaylistOpen(false); // Close new playlist dialog if open
        setNewPlaylistTitle(""); // Reset new playlist title
        setNewPlaylistImage(null); // Reset new playlist image
    };

    const handlePlaylistChange = (e) => {
        const selected = e.target.value;
        setSelectedPlaylist(selected);

        // If "new" is selected, open new playlist dialog
        if (selected === "new") {
            setNewPlaylistOpen(true);
            setNewPlaylistImage(defaultPlaylistImage); // Set default image when opening new playlist dialog
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
            imgUrl: newPlaylistImage || defaultPlaylistImage, // Use default image if no image is selected
            songs: [] // Empty array for new playlist songs
        };
        dispatch(addPlaylist(newPlaylist));
        setSelectedPlaylist(newPlaylist.id); // Select newly created playlist
        setNewPlaylistOpen(false);
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewPlaylistImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    return (
        <div className="song" onClick={() => {
            dispatch(changeSong(props));
            setTimeout(() => {
                if (song?.id !== props.id) {
                    const player = document.getElementById("audio");
                    player.load();
                    player.play();
                }
            })
        }}>
            <div className="song-container">
                <img className="audio-img" alt={props.title} src={props.artwork} />
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
