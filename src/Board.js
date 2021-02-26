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
    let [won, isWon] = useState(false);
    let [allPlayers, setAllPlayers] = useState([])
    let win = ""

    const onClickButton = (id) => {
        let userClick = [...board]
        if (!userClick[id]) {
            userClick[id] = OX ? 'X' : 'O'
        }
        setBoard(userClick)
        socket.emit('click', { message: userClick, OX: OX });
    }
    const onReset = () => {
        let userClick = [...board]
        userClick.fill(null)
        setBoard(userClick)
        isWon(false)
        socket.emit('click', { message: userClick, OX: false });
    }

    useEffect(() => {
        socket.on('click', (data) => {
            let userClick = [...data.message]
            setBoard(userClick);
        });
        if (user == allPlayers[0]) {
            setOX(true)
        }
        else if (user == allPlayers[1]) {
            setOX(false)
        }
        console.log(winner(board))
        if (winner(board) == 'X' || winner(board) == 'O') {
            isWon(true)
            if (winner(board) == 'X') {
                win = allPlayers[0]
            }
            else if (winner(board) == 'O') {
                win = allPlayers[1]
            }
        }
        socket.on('username', (data) => {
            setAllPlayers([data['players'][0], data['players'][1]])
            data['spec'].map(i => {
                setAllPlayers((prev) => [...prev, i])
            })
        })
    }, [board]);

    // const ren = (id) => {
    //     // Object.keys(user).map((u) => {
    //     //     console.log(u, user[u])
    //     //     if (!user[u]) {
    //     //         onClickButton(id)
    //     //     }
    //     // })
    // }


    return (
        <div>
            { won && <h1>{user} Won</h1> }
            <div className="window">
                <div className="col">
                    {allPlayers.map((player, i) => <Players key={i} i={i} player={player}/>)}
                </div>
                <div className="col">
                    <button onClick={onReset}>Reset</button>
                    <div className = "board">
                        { board.map((value, i) => <BoardBox key={i} user={user} value={value} won={won} onClickButton={()=>onClickButton(i)}/>) }
                    </div>
                </div>
            </div>
        </div>
    )
}
