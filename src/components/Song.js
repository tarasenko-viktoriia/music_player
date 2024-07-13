import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pauseAudio, playAudio } from '../Redux/playerSlice';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Song = ({ id, title, artist }) => {
    const dispatch = useDispatch();
    const isPlaying = useSelector(state => state.player.isPlaying);
    const [modalOpen, setModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newArtist, setNewArtist] = useState(artist);

    const handlePause = () => {
        dispatch(pauseAudio());
    };

    const handlePlay = () => {
        dispatch(playAudio());
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveChanges = () => {
        // Handle saving changes (dispatch action or API call)
        // For example, dispatch an action to update the title and artist
        handleCloseModal(); // Close modal after saving
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

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <div className="modal">
                    <TextField
                        label="Назва пісні"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Виконавець"
                        value={newArtist}
                        onChange={(e) => setNewArtist(e.target.value)}
                        fullWidth
                    />
                    <Button onClick={handleSaveChanges}>Зберегти</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Song;
