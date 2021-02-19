import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import { BoardBox } from './BoardBox.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board() {
    const [board, setBoard] = useState(Array(9).fill(null));
    let [OX, setOX] = useState(1);

    const onClickButton = (id) => {
        let userClick = [...board]
        if (!userClick[id]) {
            userClick[id] = (OX == 1) ? 'X' : 'O'
            setOX(!OX)
        }
        setBoard(userClick)
        socket.emit('chat', { message: userClick });
    }

    useEffect(() => {
        // Listening for a chat event emitted by the server. If received, we
        // run the code in the function that is passed in as the second arg
        socket.on('chat', (data) => {
            console.log('Chat event received!');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            // setBoard(prevMessages => [...prevMessages, data.message]);
        });
    }, []);
    return (
        <div className="board" >
        {board.map((value, i)=><BoardBox value={value} onClickButton={()=>onClickButton(i)}/>)}
        </div>
    )
}
