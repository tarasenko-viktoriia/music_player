import React from "react";
import { Link } from "react-router-dom";

const Menu = ({ isSongs, setIsSongs }) => {
    return (
        <div className="sidebar-left-items">
            <div className="sidebar-left-component">
                <img src="./image/music.png" alt="Frame 1" />
                <Link to="/" className="sidebar-left-item" onClick={() => setIsSongs(true)}>
                    Library
                </Link>
            </div>
            <div className="sidebar-left-component">
                <img src="./image/playlist.png" alt="Frame 2" />
                <Link to="/playlists" className="sidebar-left-item" onClick={() => setIsSongs(false)}>
                    Playlists
                </Link>
            </div>
            <div className="sidebar-left-component">
                <img src="./image/log_in.png" alt="Frame 3" />
                <a href="#" className="sidebar-left-item">
                    Log In
                </a>
            </div>
        </div>
    );
};

export default Menu;
