import React from 'react';
import { useDropzone } from 'react-dropzone';

function Basic({ onFilesSelected }) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                const newSongFile = acceptedFiles[0]; // Припускаємо, що додаємо лише один файл
                onFilesSelected(newSongFile);
            }
        }
    });

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
        </section>
    );
}

export default Basic;
