import React, { useState } from "react";


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
                </aside>
            </div>
            <main className="main-container">
                <input className="search-input" type="search" placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)}></input>
            </main>
            <div className="sidebar-wrapper-right">
                <aside className="sidebar-right">
                    <div></div>
                </aside>
            </div>
        </div>
    )
}