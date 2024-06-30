import React from "react";
import FadeMenu from "./sidebar-left-playlists";

export default function Menu({ isSongs, setIsSongs }) {
    return (
        <div className="sidebar-left-items">
            <div className={`sidebar-left-component ${isSongs ? "active" : ""}`} onClick={() => setIsSongs(true)}>
                <img src="./image/music.png" alt="Frame 1" />
                <a className="sidebar-left-item">
                    Library
                </a>
            </div>
            <div className="sidebar-left-component" onClick={() => setIsSongs(false)}>
                <img src="./image/playlist.png" alt="Frame 2" />
                <FadeMenu />
            </div>
            <div className={`sidebar-left-component ${isSongs ? "active" : ""}`}>
                <img src="./image/log_in.png" alt="Frame 3" />
                <a className="sidebar-left-item">
                    Log In
                </a>
            </div>
        </div>
    );
}
