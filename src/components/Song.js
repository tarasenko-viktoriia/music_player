import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pauseAudio, playAudio, updateSongDetails } from '../Redux/playerSlice';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Song = ({ id }) => {
    const dispatch = useDispatch();
    const song = useSelector(state => state.player.playlist.tracks.find(track => track._id === id));
    const isPlaying = useSelector(state => state.player.isPlaying);

    const [editOpen, setEditOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState(song ? song.name : '');
    const [editedArtist, setEditedArtist] = useState(song ? song.artist : ''); // Додайте artist до треку, якщо він відсутній

    const handlePause = () => {
        dispatch(pauseAudio());
    };

    const handlePlay = () => {
        dispatch(playAudio());
    };

    const handleOpenModal = () => {
        if (song) {
            setEditedTitle(song.name);
            setEditedArtist(song.artist);
        }
        setEditOpen(true);
    };

    const handleCloseModal = () => {
        setEditOpen(false);
    };

    const handleSaveEditedSong = () => {
        dispatch(updateSongDetails({ id, title: editedTitle, artist: editedArtist }));
        setEditOpen(false);
    };

    if (!song) {
        return null; // Або можна вивести повідомлення, що пісня не знайдена
    }

    return (
        <div className="song">
            <div className="song-container">
                <div className="name-song-container">
                    <div className="play-pause-button">
                        {isPlaying ? (
                            <PauseIcon onClick={handlePause} />
                        ) : (
                            <PlayArrowIcon onClick={handlePlay} />
                        )}
                    </div>
                    <div className="song-info">
                        <div className="song-title">{song.name}</div>
                        <div className="song-artist">{song.artist}</div> {/* Переконайтесь, що у трека є властивість artist */}
                    </div>
                </div>
                <div className="edit-button">
                    <Button onClick={handleOpenModal} startIcon={<EditIcon />} variant="outlined">
                        Редагувати
                    </Button>
                </div>
            </div>

            <Dialog open={editOpen} onClose={handleCloseModal}>
                <DialogTitle>Редагувати пісню</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Назва пісні"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Виконавець"
                        value={editedArtist}
                        onChange={(e) => setEditedArtist(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Скасувати</Button>
                    <Button onClick={handleSaveEditedSong} variant="contained" color="primary" disabled={!editedTitle || !editedArtist}>
                        Зберегти
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Song;
