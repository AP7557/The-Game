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
    let [won, isWon] = useState({ won: false, win: "" });
    let [allPlayers, setAllPlayers] = useState({ "X": "", "O": "", "spec": [] })

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
                    else {
                        return "X"
                    }
                })
                if (winner(userClick) == 'X') {
                    isWon({ won: true, user: allPlayers["X"] })
                }
                else if (winner(userClick) == 'O') {
                    isWon({ won: true, user: allPlayers["O"] })
                }
                else if (winner(userClick) == "Draw") {
                    isWon({ won: true, user: "Draw" })
                }
                setBoard(userClick)
                socket.emit('click', { message: userClick, X: X });
            }
        }
    }
    const onReset = () => {
        let userClick = [...board]
        userClick.fill(null)
        setBoard(userClick)
        socket.emit('click', { message: userClick });
        isWon({ won: false, win: "" })
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
            console.log(data)
            // setX(data.X)
            setX(() => {
                if (data.X == "O") {
                    return "X"
                }
                else {
                    return "O"
                }
            })
        });
    }, []);

    return (
        <div>
            { won.won && <h1 className="winner" >Winner: {won.user}</h1> }
            <div className="window">
                <div className="col">
                    <li className="Px">Player X: {allPlayers['X']}</li>
                    <li className="Po">Player O: {allPlayers['O']}</li>
                    {allPlayers['spec'].map((player, i) => <Players key={i} i={i} allPlayers={allPlayers} player={player}/>)}
                </div>
                <div className="col">
                    {won.won
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
