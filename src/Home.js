import React from "react";


export default function Home(){
    return (
        <div className="home">
            <div className="sidebar-wrapper-left">
                <aside className="sidebar-left">
                    <div>
                        <img src="../logo.png" alt="Logo"></img>
                        <p>Bits</p>
                    </div>
                </aside>
            </div>
            <main className="main-container">
                <div></div>
            </main>
            <div className="sidebar-wrapper-right">
                <aside className="sidebar-right">
                    <div></div>
                </aside>
            </div>
        </div>
    )
}