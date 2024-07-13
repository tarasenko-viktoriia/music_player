import React from 'react';
import { useDispatch } from 'react-redux';
import { addTrackToPlaylist } from '../Redux/playerSlice';

const UploadTrack = () => {
    const dispatch = useDispatch();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            const url = URL.createObjectURL(file);
            const newTrack = {
                _id: Date.now().toString(),
                url: url,
                name: file.name,
            };
            dispatch(addTrackToPlaylist(newTrack));
        } else {
            alert('Please upload a valid audio file.');
        }
    };

    return (
        <div>
            <input type="file" accept="audio/*" onChange={handleFileUpload} />
        </div>
    );
};

export default UploadTrack;