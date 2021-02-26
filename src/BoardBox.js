import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection
export function BoardBox({ onClickButton, value, won, user }) {
    let [switchXO, setSwitchOX] = useState('X')
    let [player, setPlayer] = useState(false)
    const helperClick = () => {
        if (player) {
            if (!won.won) {
                onClickButton()
            }
            // if (value == switchXO) {
                //     onClickButton()
                //     switchXO == 'X' ? setSwitchOX('O') : setSwitchOX('X')
                // }
        }
    }
    useEffect(() => {
        socket.on('username', (data) => {
            if (user == data[0] || user == data[1]) {
                setPlayer(true)
            }
        })
    });

    return (
        <div className="box" onClick={helperClick}>{value}</div>
    )
}
