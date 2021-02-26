import { React, useState, useEffect } from 'react'
import './styles/App.css';
import { Board } from './Board.js'
import { Login } from './Login.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
    let [login, isLogin] = useState(false)
    let [user, setUserName] = useState("")

    const signin = (username) => {
        if (username != "") {
            isLogin(!login)
            setUserName(username)
            socket.emit('username', { username });
        }
        else {
            alert("Please type in a username")
        }
    }

    useEffect(() => {
        return () => {
            // This function will only be run when the component unmounts
            socket.emit('logout', { user }) // your data here }});
        }
    })
    return (
        <div>
            <h1 className="game"> Tic-Tac-Toe</h1>
            {login ?
                (<Board user={user}/>):
                <Login signin={signin}/>}
        </div>
    );
}

export default App;
