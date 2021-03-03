import { React, useState, useEffect } from 'react'
import './styles/App.css';
import { Board } from './Board.js'
import { Login } from './Login.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
    let [login, isLogin] = useState(false)
    let [currentUser, setCurrentUserName] = useState("")

    const signin = (username) => {
        if (username != "") {
            isLogin((prev) => {
                return !prev
            })
            setCurrentUserName(username)
            socket.emit('join', { username })
            socket.emit('username', { username });
        }
        else {
            alert("Please type in a username")
        }
    }

    const logout = () => {
        isLogin(false)
        setCurrentUserName("")
        socket.emit('logout', { currentUser })
    }

    return (
        <div>
            <h1 className="game"> Tic-Tac-Toe</h1>
            {login && <button onClick={logout}>Log-out</button>}
            {currentUser && <h4 className="current">Your Username: {currentUser}</h4>}
            {login ?
                (
                    <Board currentUser={currentUser}/>
                ):
                    <Login signin={signin}/>}

        </div>
    );
}

export default App;
