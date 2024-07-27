// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { changeSong, updateSongDetails, moveSongUp, moveSongDown } from "../Redux/reducer/song";
// import { addSongToPlaylist, addPlaylist } from "../Redux/reducer/list";
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, TextField } from '@mui/material';

// const defaultPlaylistImage = '../image/default-img.jpg';

// export default function Song(props) {
//     const song = useSelector(state => state.song.currentSong);
//     const playlists = useSelector(state => state.list.playlists);
//     const dispatch = useDispatch();

//     const [open, setOpen] = useState(false);
//     const [editOpen, setEditOpen] = useState(false);
//     const [selectedPlaylist, setSelectedPlaylist] = useState("");
//     const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);
//     const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
//     const [newPlaylistImage, setNewPlaylistImage] = useState(null);
//     const [editedTitle, setEditedTitle] = useState(props.title);
//     const [editedArtist, setEditedArtist] = useState(props.artist);
//     const [editedImage, setEditedImage] = useState(null);
//     const [isPlaying, setIsPlaying] = useState(false);

//     useEffect(() => {
//         setEditedTitle(props.title);
//         setEditedArtist(props.artist);
//         setEditedImage(props.image);
//     }, [props.title, props.artist, props.image]);

//     useEffect(() => {
//         if (song && song.id === props.id) {
//             setIsPlaying(true);
//         } else {
//             setIsPlaying(false);
//         }
//     }, [song, props.id]);

//     useEffect(() => {
//         const containingPlaylists = playlists.filter(playlist => 
//             playlist.songs.includes(props.id)
//         );
//     }, [playlists, props.id]);

//     const handleAddSong = (e) => {
//         e.stopPropagation();
//         setOpen(true);
//     };

//     const handleDialogClose = () => {
//         setOpen(false);
//         setNewPlaylistOpen(false);
//         setNewPlaylistTitle("");
//         setNewPlaylistImage(null);
//         setEditOpen(false);
//     };

//     const handlePlaylistChange = (e) => {
//         const selected = e.target.value;
//         setSelectedPlaylist(selected);

//         if (selected === "new") {
//             setNewPlaylistOpen(true);
//             setNewPlaylistImage(defaultPlaylistImage);
//         }
//     };

//     const handleAddSongToPlaylist = () => {
//         dispatch(addSongToPlaylist({ playlistId: selectedPlaylist, song: props }));
//         setOpen(false);
//     };

//     const handleAddNewPlaylist = () => {
//         const newPlaylist = {
//             id: playlists.length + 1,
//             title: newPlaylistTitle,
//             imgUrl: newPlaylistImage || defaultPlaylistImage,
//             songs: []
//         };
//         dispatch(addPlaylist(newPlaylist));
//         setSelectedPlaylist(newPlaylist.id);
//         setNewPlaylistOpen(false);
//     };

//     const handleImageChangePlaylist = (event) => {
//         if (event.target.files && event.target.files[0]) {
//             setNewPlaylistImage(URL.createObjectURL(event.target.files[0]));
//         }
//     };

//     const handleChangeSong = () => {
//         if (song && song.id === props.id) {
//             const player = document.getElementById("audio");
//             if (isPlaying) {
//                 player.pause();
//             } else {
//                 player.play();
//             }
//             setIsPlaying(!isPlaying);
//         } else {
//             dispatch(changeSong(props));
//             const player = document.getElementById("audio");
//             player.load();
//             player.play();
//             setIsPlaying(true);
//         }
//     };

//     const handleEditSong = (e) => {
//         e.stopPropagation();
//         setEditOpen(true);
//     };

//     const handleSaveEditedSong = () => {
//         dispatch(updateSongDetails({ id: props.id, title: editedTitle, artist: editedArtist, image: editedImage }));
//         setEditOpen(false);
//     };

//     const handleMoveSongUp = (e) => {
//         e.stopPropagation();
//         dispatch(moveSongUp(props.id));
//     };

//     const handleMoveSongDown = (e) => {
//         e.stopPropagation();
//         dispatch(moveSongDown(props.id));
//     };

//     return (
//         <div className={`song ${isPlaying ? 'playing' : ''}`} onClick={handleChangeSong}>
//             <div className="song-container">
//                 <div className="name-song-container">
//                     {isPlaying ? (
//                         <PauseIcon />
//                     ) : (
//                         <PlayArrowIcon />
//                     )}
//                     <div className="song-info">
//                         <div className="song-title">{props.title}</div>
//                         <div className="song-artist">{props.artist}</div>
//                     </div>
//                 </div>
//                 <div className="song-button">
//                     <AddIcon onClick={handleAddSong} />
//                     <EditIcon onClick={handleEditSong} />
//                     <ArrowUpwardIcon onClick={handleMoveSongUp} />
//                     <ArrowDownwardIcon onClick={handleMoveSongDown} />
//                 </div>
//             </div>

//             <Dialog open={open} onClose={handleDialogClose}>
//                 <DialogTitle>Виберіть плейлист</DialogTitle>
//                 <DialogContent>
//                     <Select
//                         value={selectedPlaylist}
//                         onChange={handlePlaylistChange}
//                         fullWidth
//                     >
//                         {playlists.map(playlist => (
//                             <MenuItem key={playlist.id} value={playlist.id}>
//                                 {playlist.title}
//                             </MenuItem>
//                         ))}
//                         <MenuItem value="new">Створити новий плейлист</MenuItem>
//                     </Select>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose}>Скасувати</Button>
//                     <Button onClick={handleAddSongToPlaylist} color="primary" disabled={!selectedPlaylist}>
//                         Додати
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Dialog open={newPlaylistOpen} onClose={handleDialogClose}>
//                 <DialogTitle>Новий плейлист</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         fullWidth
//                         label="Назва плейлисту"
//                         value={newPlaylistTitle}
//                         onChange={(e) => setNewPlaylistTitle(e.target.value)}
//                     />
//                     <Button
//                         variant="contained"
//                         component="label"
//                         sx={{ mt: 2 }}
//                     >
//                         Завантажити зображення
//                         <input
//                             type="file"
//                             hidden
//                             onChange={handleImageChangePlaylist}
//                         />
//                     </Button>
//                     {newPlaylistImage && (
//                         <img src={newPlaylistImage} alt="Playlist" style={{ marginTop: '10px', width: '100%' }} />
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose}>Скасувати</Button>
//                     <Button onClick={handleAddNewPlaylist} variant="contained" color="primary" disabled={!newPlaylistTitle}>
//                         Додати
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Dialog open={editOpen} onClose={handleDialogClose}>
//                 <DialogTitle>Редагувати пісню</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         fullWidth
//                         label="Назва пісні"
//                         value={editedTitle}
//                         onChange={(e) => setEditedTitle(e.target.value)}
//                         sx={{ mb: 2 }}
//                     />
//                     <TextField
//                         fullWidth
//                         label="Виконавець"
//                         value={editedArtist}
//                         onChange={(e) => setEditedArtist(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose}>Скасувати</Button>
//                     <Button onClick={handleSaveEditedSong} variant="contained" color="primary" disabled={!editedTitle || !editedArtist}>
//                         Зберегти
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// }

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSong, updateSongDetails, moveSongUp, moveSongDown } from "../Redux/reducer/song";
import { addSongToPlaylist, addPlaylist } from "../Redux/reducer/list";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, TextField } from '@mui/material';

const defaultPlaylistImage = '../image/default-img.jpg';

export default function Song(props) {
    const song = useSelector(state => state.song.currentSong);
    const playlists = useSelector(state => state.list.playlists);
    const dispatch = useDispatch();
    const audioRef = useRef(new Audio(props.url));

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
    const [newPlaylistImage, setNewPlaylistImage] = useState(null);
    const [editedTitle, setEditedTitle] = useState(props.title);
    const [editedArtist, setEditedArtist] = useState(props.artist);
    const [editedImage, setEditedImage] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setEditedTitle(props.title);
        setEditedArtist(props.artist);
        setEditedImage(props.image);
    }, [props.title, props.artist, props.image]);

    useEffect(() => {
        if (song && song.id === props.id) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [song, props.id]);

    useEffect(() => {
        const handleEnded = () => {
            setIsPlaying(false);
        };
        audioRef.current.addEventListener('ended', handleEnded);
        return () => {
            audioRef.current.removeEventListener('ended', handleEnded);
        };
    }, []);

    const playAudio = () => {
        if (audioRef.current.paused) {
            audioRef.current.play().catch(error => console.error('Audio play error:', error));
        }
    };

    const pauseAudio = () => {
        if (!audioRef.current.paused) {
            audioRef.current.pause();
        }
    };

    const handleChangeSong = () => {
        if (song && song.id === props.id) {
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
            setIsPlaying(!isPlaying);
        } else {
            dispatch(changeSong(props));
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current = new Audio(props.url);
            playAudio();
            setIsPlaying(true);
        }
    };

    const handleAddSong = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setNewPlaylistOpen(false);
        setNewPlaylistTitle("");
        setNewPlaylistImage(null);
        setEditOpen(false);
    };

    const handlePlaylistChange = (e) => {
        const selected = e.target.value;
        setSelectedPlaylist(selected);

        if (selected === "new") {
            setNewPlaylistOpen(true);
            setNewPlaylistImage(defaultPlaylistImage);
        }
    };

    const handleAddSongToPlaylist = () => {
        dispatch(addSongToPlaylist({ playlistId: selectedPlaylist, song: props }));
        setOpen(false);
    };

    const handleAddNewPlaylist = () => {
        const newPlaylist = {
            id: playlists.length + 1,
            title: newPlaylistTitle,
            imgUrl: newPlaylistImage || defaultPlaylistImage,
            songs: []
        };
        dispatch(addPlaylist(newPlaylist));
        setSelectedPlaylist(newPlaylist.id);
        setNewPlaylistOpen(false);
    };

    const handleImageChangePlaylist = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewPlaylistImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleEditSong = (e) => {
        e.stopPropagation();
        setEditOpen(true);
    };

    const handleSaveEditedSong = () => {
        dispatch(updateSongDetails({ id: props.id, title: editedTitle, artist: editedArtist, image: editedImage }));
        setEditOpen(false);
    };

    const handleMoveSongUp = (e) => {
        e.stopPropagation();
        dispatch(moveSongUp(props.id));
    };

    const handleMoveSongDown = (e) => {
        e.stopPropagation();
        dispatch(moveSongDown(props.id));
    };

    return (
        <div className={`song ${isPlaying ? 'playing' : ''}`} onClick={handleChangeSong}>
            <div className="song-container">
                <div className="name-song-container">
                    {isPlaying ? (
                        <PauseIcon />
                    ) : (
                        <PlayArrowIcon />
                    )}
                    <div className="song-info">
                        <div className="song-title">{props.title}</div>
                        <div className="song-artist">{props.artist}</div>
                    </div>
                </div>
                <div className="song-button">
                    <AddIcon onClick={handleAddSong} />
                    <EditIcon onClick={handleEditSong} />
                    <ArrowUpwardIcon onClick={handleMoveSongUp} />
                    <ArrowDownwardIcon onClick={handleMoveSongDown} />
                </div>
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
                            onChange={handleImageChangePlaylist}
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

            <Dialog open={editOpen} onClose={handleDialogClose}>
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
                    <Button onClick={handleDialogClose}>Скасувати</Button>
                    <Button onClick={handleSaveEditedSong} variant="contained" color="primary" disabled={!editedTitle || !editedArtist}>
                        Зберегти
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
