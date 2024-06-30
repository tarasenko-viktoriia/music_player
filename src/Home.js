import React, { useState } from "react";
import FadeMenu from "./components/sidebar-left-playlists";



export default function Home(){
    const [search, setSearch] = useState("");
    return (
        <div className="home">
            <div className="sidebar-wrapper-left">
                <aside className="sidebar-left">
                    <div className="logo-container">
                        <img src="../logo.png" alt="Logo"></img>
                        <p>Bits</p>
                    </div>
                    <div className="sidebar-left-items">
                        <div>
                            <div className="sidebar-left-component">
                                <img src="./image/music.png" alt="Frame 1" />
                                <a className="sidebar-left-item">
                                    Library
                                </a>
                            </div>
                            <div className="sidebar-left-component">
                                <img src="./image/playlist.png" alt="Frame 2" />
                                <FadeMenu/>
                            </div>
                        </div>
                        <div className="sidebar-left-component">
                            <img src="./image/log_in.png" alt="Frame 3" />
                            <a className="sidebar-left-item">
                                Log In
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
            <main className="main-container">
                <input className="search-input" type="search" placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)}></input>
            </main>
            <div className="sidebar-wrapper-right">
                <aside className="sidebar-right">
                    <div className="log-in-container">
                        <p>To use all Bits functions, login into your account</p>
                        <button>Log in</button>
                    </div>
                </aside>
            </div>
        </div>
    )
}