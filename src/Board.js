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
    let [allPlayers, setAllPlayers] = useState({ "X": "", "O": "", "spec": [] })

    const onClickButton = (id) => {
        let userClick = [...board]
        if (!userClick[id]) {
            if (user == allPlayers["X"]) {
                userClick[id] = "X"
            }
            if (user == allPlayers["O"]) {
                userClick[id] = "O"
            }
        }
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
        socket.on('username', (data) => {
            Object.keys(data).map((item) => {
                setAllPlayers((prev) => ({
                    ...prev,
                    [item]: data[item]
                }))
            })
        })
        //dic player x as key, player y as key, and spec as array

        //counter, everytime click counter to 1
        socket.on('click', (data) => {
            let userClick = [...data.message]
            setBoard(userClick);
            setOX((prev) => {
                return !prev
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
                    {(user == allPlayers["X"] || user == allPlayers["O"]) && won.won
                        && <button className="reset_button" onClick={onReset}>Reset</button>}
                    <div className = "board">
                        { board.map((value, i) => <BoardBox key={i} user={user} OX={OX} value={value} won={won} onClickButton={()=>onClickButton(i)}/>) }
                    </div>
                </div>
            </div>
        </div>
    )
}
