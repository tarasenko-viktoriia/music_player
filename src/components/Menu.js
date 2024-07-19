import React from "react";
import { Link } from "react-router-dom";

export default function Menu({ isSongs, setIsSongs }) {
    return (
        <div className="sidebar-left-items">
            <div className={`sidebar-left-component ${isSongs ? "active" : ""}`} onClick={() => setIsSongs(true)}>
                <img src="./image/music.png" alt="Frame 1" />
                <Link to="/library" className="sidebar-left-item">
                    Library
                </Link>
            </div>
            <div className="sidebar-left-component" onClick={() => setIsSongs(false)}>
                <img src="./image/playlist.png" alt="Frame 2" />
                <Link to="/playlists" className="sidebar-left-item">
                    Playlists
                </Link>
            </div>
        </div>
    );
}
