import React from "react";

export default function Menu() {
    return (
        <div className="sidebar-left-items">
            <div className={`sidebar-left-component`}>
                <img src="./image/music.png" alt="Frame 1" />
                <a className="sidebar-left-item">
                    Library
                </a>
            </div>
            <div className="sidebar-left-component">
                <img src="./image/playlist.png" alt="Frame 2" />
                <a className="sidebar-left-item">
                    Playlists
                </a>
            </div>
            <div className={`sidebar-left-component`}>
                <img src="./image/log_in.png" alt="Frame 3" />
                <a className="sidebar-left-item">
                    Log In
                </a>
            </div>
        </div>
    );
}
