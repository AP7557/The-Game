import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection
export function BoardBox({ onClickButton, value, won, user, OX }) {
    // let [switchXO, setSwitchOX] = useState('X')
    let [player, setPlayer] = useState(false)
    let [next, setNex] = useState(0)

    const helperClick = () => {
        if (player) {
            // if (OX) {
            //     switchXO
            // }
            console.log(OX, user)
            setNex(1)
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
                //setNex(0)
            }
        })
    });

    return (
        <div className="box" onClick={helperClick}>{value}</div>
    )
}
