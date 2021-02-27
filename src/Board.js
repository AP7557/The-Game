import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import { BoardBox } from './BoardBox.js'
import { winner } from './Winner.js'
import { Players } from './Players.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board({ user }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    let [X, setX] = useState("X");
    let [won, isWon] = useState(false);
    let [allPlayers, setAllPlayers] = useState({ "X": "", "O": "", "spec": [] })
    let status = winner(board)
    let userWinner = ""
    if (status == "X") {
        userWinner = allPlayers["X"]
    }
    else if (status == "O") {
        userWinner = allPlayers["O"]
    }
    else if (status == "Draw") {
        userWinner = status
    }

    const onClickButton = (id) => {
        let userClick = [...board]
        console.log(user, allPlayers[X], X)
        if (!userClick[id]) {
            if (user == allPlayers[X]) {
                userClick[id] = X
                setX((prev) => {
                    if (prev == "X") {
                        return "O"
                    }
                    else if (prev == "O") {
                        return "X"
                    }
                })
                setBoard(userClick)
                socket.emit('click', { message: userClick, X: X });
            }
        }
        if (winner((userClick))) {
            isWon(true)
        }
    }
    const onReset = () => {
        let userClick = [...board]
        userClick.fill(null)
        setBoard(userClick)
        isWon(false)
        socket.emit('click', { message: userClick, X: "O" });
    }

    useEffect(() => {
        socket.on('username', (data) => {
            Object.keys(data).map((item) => {
                setAllPlayers((prev) => ({
                    ...prev,
                    [item]: data[item]
                }))
            })
        })
        socket.on('click', (data) => {
            let userClick = [...data.message]
            setBoard(userClick);
            console.log(data.X)
            isWon(false)
            if (winner((userClick))) {
                isWon(true)
            }
            setX(() => {
                if (data.X == "X") {
                    return "O"
                }
                else if (data.X == "O") {
                    return "X"
                }
            })
            console.log(X)
        });
    }, []);

    return (
        <div>
            { won && <h1 className="winner" >Winner: {userWinner}</h1> }
            <div className="window">
                <div className="col">
                    <li className="Px">Player X: {allPlayers['X']}</li>
                    <li className="Po">Player O: {allPlayers['O']}</li>
                    {allPlayers['spec'].map((player, i) => <Players key={i} player={player}/>)}
                </div>
                <div className="col">
                    {(user == allPlayers["X"] || user == allPlayers["O"]) && won
                        && <button className="reset_button" onClick={onReset}>Reset</button>}
                    <h4>Current Player: {allPlayers[X]}</h4>
                    <div className = "board">
                        { board.map((value, i) => <BoardBox key={i} user={user} value={value} won={won} onClickButton={()=>onClickButton(i)}/>) }
                    </div>
                </div>
            </div>
        </div>
    )
}
