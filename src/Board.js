import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import { BoardBox } from './BoardBox.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board() {
    const [board, setBoard] = useState(Array(9).fill(null));
    let [OX, setOX] = useState(true);
    
    const onClickButton = (id) => {
        let userClick = [...board]
        if (!userClick[id]) {
            userClick[id] = OX ? 'X' : 'O'
        }
        setBoard(userClick)

        socket.emit('click', { message: userClick, OX: OX });
    }

    useEffect(() => {
        socket.on('click', (data) => {
            console.log(data);
            let userClick = [...data.message]

            setBoard(userClick);
            console.log(data.OX)
            setOX(!data.OX)
        });
    }, []);

    return (
        <div>
            <div className = "board" >
                { board.map((value, i) => <BoardBox key={i} value={value} onClickButton={()=>onClickButton(i)}/>) }
            </div>
        </div>
    )
}
