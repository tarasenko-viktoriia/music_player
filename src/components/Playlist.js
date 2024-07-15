import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeList, addPlaylist, removePlaylist, changePlaylist, moveSongUp, moveSongDown} from "../Redux/reducer/list";
import Song from "./Song";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Modal, Box, TextField, Button, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const defaultPlaylistImage = '../image/default-img.jpg';

export default function Playlist({ search }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const [newPlaylistImage, setNewPlaylistImage] = useState(null);
    const [editingPlaylistId, setEditingPlaylistId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
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
        setEditingPlaylistId(null);
    };

    const handleSavePlaylist = () => {
        if (editingPlaylistId !== null) {
            dispatch(changePlaylist({
                id: editingPlaylistId,
                title: newPlaylistTitle,
                imgUrl: newPlaylistImage || defaultPlaylistImage
            }));
        } else {
            const newPlaylist = {
                id: playlists.length + 1,
                title: newPlaylistTitle,
                imgUrl: newPlaylistImage || defaultPlaylistImage,
                songs: []
            };
            dispatch(addPlaylist(newPlaylist));
        }
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

    const handleEditPlaylist = (playlist) => {
        setNewPlaylistTitle(playlist.title);
        setNewPlaylistImage(playlist.imgUrl);
        setEditingPlaylistId(playlist.id);
        setModalOpen(true);
        setAnchorEl(null);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMoveSongUp = (playlistId, songId) => {
        dispatch(moveSongUp({ playlistId, songId }));
    };

    const handleMoveSongDown = (playlistId, songId) => {
        dispatch(moveSongDown({ playlistId, songId }));
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
                                    onMoveUp={() => handleMoveSongUp(song.id, selectedPlaylist.id)}
                                    onMoveDown={() => handleMoveSongDown(song.id, selectedPlaylist.id)}
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
                            <Button aria-controls="playlist-menu" aria-haspopup="true" onClick={handleMenuClick}>
                                <MoreVertIcon />
                            </Button>
                            <Menu
                                id="playlist-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => handleEditPlaylist(playlist)}>
                                    Змінити назву та зображення
                                </MenuItem>
                                <MenuItem onClick={() => handleRemovePlaylist(playlist.id)}>
                                    Видалити плейлист
                                </MenuItem>
                            </Menu>
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
                    <h2 id="simple-modal-title">{editingPlaylistId !== null ? 'Редагувати плейлист' : 'Новий плейлист'}</h2>
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
                    <Button onClick={handleSavePlaylist} variant="contained" color="primary" sx={{ mt: 2 }}>
                        {editingPlaylistId !== null ? 'Зберегти зміни' : 'Додати'}
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
