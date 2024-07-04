import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeList, addPlaylist, removePlaylist } from "../Redux/reducer/list";
import Song from "./Song";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Modal, Box, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const defaultPlaylistImage = '../image/default-img.jpg' // Replace with your default image URL

export default function Playlist({ search }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const [newPlaylistImage, setNewPlaylistImage] = useState(null);
    const list = useSelector(state => state.list.value);
    const playlists = useSelector(state => state.list.playlists);
    const dispatch = useDispatch();

    const handlePlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist);
        dispatch(changeList(playlist.songs));
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setNewPlaylistTitle('');
        setNewPlaylistImage(null);
    };

    const handleAddPlaylist = () => {
        const newPlaylist = {
            id: playlists.length + 1,
            title: newPlaylistTitle,
            imgUrl: newPlaylistImage || defaultPlaylistImage, // Use default image if no image is selected
            songs: [] // Empty array for new playlist songs
        };
        dispatch(addPlaylist(newPlaylist));
        handleCloseModal();
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewPlaylistImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleRemovePlaylist = (id) => {
        dispatch(removePlaylist(id));
    };

    return (
        <div>
            {selectedPlaylist ? (
                <div>
                    <ArrowBackIosIcon onClick={() => setSelectedPlaylist(null)} />
                    <div>
                        {selectedPlaylist.songs
                            .filter(song => song.title.toLowerCase().includes(search.toLowerCase()))
                            .map(song => (
                                <Song
                                    key={song.id}
                                    id={song.id}
                                    title={song.title}
                                    artist={song.artist}
                                    artwork={song.artwork}
                                    location="playlist"
                                    playlistId={selectedPlaylist.id}
                                />
                            ))}
                    </div>
                </div>
            ) : (
                <div className="playlist-container">
                    {playlists.filter(playlist =>
                        playlist.title.toLowerCase().includes(search.toLowerCase())
                    ).map(playlist => (
                        <div key={playlist.id} className="playlist-items">
                            <CloseIcon onClick={() => handleRemovePlaylist(playlist.id)} />
                            <img className="audio-img" alt={playlist.title} src={playlist.imgUrl} onClick={() => handlePlaylistClick(playlist)} />
                            <div>{playlist.title}</div>
                        </div>
                    ))}
                    <Button onClick={handleOpenModal} variant="contained" color="primary">
                        Додати новий плейлист
                    </Button>
                </div>
            )}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2 id="simple-modal-title">Новий плейлист</h2>
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
                    <Button onClick={handleAddPlaylist} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Додати
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
