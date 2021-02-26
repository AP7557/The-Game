import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import { BoardBox } from './BoardBox.js'
import { winner } from './Winner.js'
import { Players } from './Players.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board({ user }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    let [OX, setOX] = useState(true);
    let [won, isWon] = useState({ won: false, win: "" });
    let [allPlayers, setAllPlayers] = useState([])

    const onClickButton = (id) => {
        let userClick = [...board]
        if (!userClick[id]) {
            userClick[id] = OX ? 'X' : 'O'
        }
        if (user == allPlayers[0]) {
            setOX(true)
        }
        else if (user == allPlayers[1]) {
            setOX(false)
        }
        if (winner(userClick) == 'X') {
            isWon({ won: true, user: allPlayers[0] })
        }
        else if (winner(userClick) == 'O') {
            isWon({ won: true, user: allPlayers[1] })
        }
        setBoard(userClick)
        socket.emit('click', { message: userClick, OX: OX });
    }
    const onReset = () => {
        let userClick = [...board]
        userClick.fill(null)
        setBoard(userClick)
        isWon({ won: false, win: "" })
        socket.emit('click', { message: userClick, OX: true });
    }

    useEffect(() => {
        socket.on('click', (data) => {
            let userClick = [...data.message]
            setBoard(userClick);
        });
        socket.on('username', (data) => {
            setAllPlayers([data['players'][0], data['players'][1]])
            data['spec'].map(i => {
                setAllPlayers((prev) => [...prev, i])
            })
        })
    }, []);

    return (
        <div>
            { won.won && <h1 className="winner" >Winner: {won.user}</h1> }
            <div className="window">
                <div className="col">
                    {allPlayers.map((player, i) => <Players key={i} i={i} player={player}/>)}
                </div>
                <div className="col">
                    {(user == allPlayers[0] || user == allPlayers[1]) && won.won
                        && <button className="reset_button" onClick={onReset}>Reset</button>}
                    <div className = "board">
                        { board.map((value, i) => <BoardBox key={i} user={user} value={value} won={won} onClickButton={()=>onClickButton(i)}/>) }
                    </div>
                </div>
            </div>
        </div>
    )
}
