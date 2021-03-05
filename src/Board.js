import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import { BoardBox } from './BoardBox.js'
import { getWinnerFunction } from './Winner.js'
import { Leaderboard } from './Leaderboard.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board({ currentUser, userList }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    let [OXs, setOXs] = useState("X");
    let [winner, setWinner] = useState({ isWinner: false, userWinner: "" });
    let [allPlayers, setAllPlayers] = useState({ "X": "", "O": "", "spec": [] })
    let [showLeaderboard, setShowLeaderboard] = useState(false)

    const onClickButton = (id) => {
        let userClick = [...board]
        console.log(OXs, winner)
        if (!userClick[id]) {
            if (currentUser == allPlayers[OXs]) {
                userClick[id] = OXs
                setBoard(userClick)
                socket.emit('click', { message: userClick, OXs });
            }
        }
    }
    const onReset = () => {
        let userClick = [...board]
        userClick.fill(null)
        socket.emit('reset', { message: userClick, OXs: "X", winner: false });
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
            let status = getWinnerFunction(userClick)
            console.log(data)
            if (status) {
                console.log(winner)
                if (status == "X") {
                    setWinner({ isWinner: true, userWinner: allPlayers['X'] })
                    socket.emit('winner', { winner: allPlayers['X'], loser: allPlayers['O'] });
                }
                else if (status == "O") {
                    setWinner({ isWinner: true, userWinner: allPlayers['O'] })
                    socket.emit('winner', { winner: allPlayers['O'], loser: allPlayers['X'] });
                }
                else if (status == "Draw") {
                    setWinner({ isWinner: true, userWinner: "DRAW" })
                }
                console.log(winner)
            }
            setOXs(() => {
                if (data.OXs == "X") {
                    return "O"
                }
                else if (data.OXs == "O") {
                    return "X"
                }
            })
        });
        socket.on('reset', (data) => {
            let userClick = [...data.message]
            console.log(data)
            setBoard(userClick);
            setWinner({ isWinner: data.winner, userWinner: "" })
            setOXs(data.OXs)
        });
    }, []);

    return (
        <div>
            { winner.isWinner && <h1 className="winner" >Winner: {winner.userWinner}</h1> }
            <div className="window">
                <div className="col">
                    <li className="Px">Player X: {allPlayers['X']}</li>
                    <li className="Po">Player O: {allPlayers['O']}</li>
                    {allPlayers['spec'].map((player) => <li className="Ps"> Spectors: {player} </li>)}
                </div>
                <div className="col">
                    {(currentUser == allPlayers["X"] || currentUser == allPlayers["O"]) && winner.isWinner
                        && <button className="reset_button" onClick={onReset}>Reset</button>}
                    <h4>Current Player: {allPlayers[OXs]}</h4>
                    <div className = "board">
                        { board.map((value, i) => <BoardBox key={i} currentUser={currentUser} value={value} winner={winner.isWinner} onClickButton={()=>onClickButton(i)}/>) }
                    </div>
                </div>
                <div className="col">
                    <button onClick={()=>{setShowLeaderboard((prev)=>!prev)}}>
                        {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
                    </button>
                    {showLeaderboard && <Leaderboard userList={userList}/>}
                    </div>
            </div>
        </div>
    )
}
//
