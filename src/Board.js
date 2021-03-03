import { React, useState, useEffect } from 'react'
import './styles/Board.css';
import { BoardBox } from './BoardBox.js'
import { getWinnerFunction } from './Winner.js'
import { Leaderboard } from './Leaderboard.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board({ currentUser }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    let [OXs, setOXs] = useState("X");
    let [winner, setWinner] = useState(false);
    let [allPlayers, setAllPlayers] = useState({ "X": "", "O": "", "spec": [] })
    let [showLeaderboard, setShowLeaderboard] = useState(false)
    let [userList, setUserList] = useState([]);

    let status = getWinnerFunction(board)
    let userWinner = ""
    if (status == "X") {
        userWinner = allPlayers["X"]
        socket.emit('winner', { winner: allPlayers['X'], loser: allPlayers['O'] });
    }
    else if (status == "O") {
        userWinner = allPlayers["O"]
        socket.emit('winner', { winner: allPlayers['O'], loser: allPlayers['X'] });
    }
    else if (status == "Draw") {
        userWinner = status
    }

    const onClickButton = (id) => {
        let userClick = [...board]
        console.log(OXs, winner)
        if (!userClick[id]) {
            if (currentUser == allPlayers[OXs]) {
                userClick[id] = OXs
                setOXs((prev) => {
                    if (prev == "X") {
                        return "O"
                    }
                    else if (prev == "O") {
                        return "X"
                    }
                })
                setBoard(userClick)
                socket.emit('click', { message: userClick, OXs });
            }
        }
        if (getWinnerFunction((userClick))) {
            setWinner(true)
        }
    }
    const onReset = () => {
        let userClick = [...board]
        userClick.fill(null)
        setBoard(userClick)
        setWinner(false)
        socket.emit('reset', { message: userClick, OXs: "X", winner: false });
    }

    useEffect(() => {
        socket.on('user_list', (data) => {
            console.log('User list event received!');
            console.log(data);
            setUserList(data.users)
        });
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
            if (getWinnerFunction((userClick))) {
                setWinner(true)
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
            setBoard(userClick);
            setWinner(data.winner)
            setOXs(data.OXs)
        });
    }, []);

    return (
        <div>
            { winner && <h1 className="winner" >Winner: {userWinner}</h1> }
            <div className="window">
                <div className="col">
                    <li className="Px">Player X: {allPlayers['X']}</li>
                    <li className="Po">Player O: {allPlayers['O']}</li>
                    {allPlayers['spec'].map((player) => <li className="Ps"> Spectors: {player} </li>)}
                </div>
                <div className="col">
                    {(currentUser == allPlayers["X"] || currentUser == allPlayers["O"]) && winner
                        && <button className="reset_button" onClick={onReset}>Reset</button>}
                    <h4>Current Player: {allPlayers[OXs]}</h4>
                    <div className = "board">
                        { board.map((value, i) => <BoardBox key={i} currentUser={currentUser} value={value} winner={winner} onClickButton={()=>onClickButton(i)}/>) }
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
