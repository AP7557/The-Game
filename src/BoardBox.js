import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection
export function BoardBox({ onClickButton, value, won, user }) {
    let [player, setPlayer] = useState(false)

    const helperClick = () => {
        if (player) {
            if (!won.won) {
                onClickButton()
            }
        }
    }
    useEffect(() => {
        socket.on('username', (data) => {
            console.log(user, data["X"], data["O"])
            if (user == data["X"] || user == data["O"]) {
                setPlayer(true)
            }
        })
    });

    return (
        <div className="box" onClick={helperClick}>{value}</div>
    )
}
