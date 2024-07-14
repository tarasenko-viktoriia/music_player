import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pauseAudio, playAudio, updateSongDetails } from '../Redux/playerSlice';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Song = ({ id, title, artist }) => {
    const dispatch = useDispatch();
    const isPlaying = useSelector(state => state.player.isPlaying);
    const [modalOpen, setModalOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title || ''); 
    const [editedArtist, setEditedArtist] = useState(artist || '');

    const handlePause = () => {
        dispatch(pauseAudio());
    };

    const handlePlay = () => {
        dispatch(playAudio());
    };

    const handleOpenModal = () => {
        setEditOpen(true);
    };

    const handleCloseModal = () => {
        setEditOpen(false);
    };

    const handleSaveEditedSong = () => {
        dispatch(updateSongDetails({ id, title: editedTitle, artist: editedArtist }));
        setEditOpen(false);
    };

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
                        <div className="song-title">{title}</div>
                        <div className="song-artist">{artist}</div>
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
