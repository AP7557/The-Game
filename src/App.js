import { React, useState, useEffect } from 'react'
import './styles/App.css';
import { Board } from './Board.js'
import { Login } from './Login.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
    let [login, isLogin] = useState(false)
    let [currentUser, setCurrentUserName] = useState("")
    const [userList, setUserList] = useState([]);

    const signin = (username) => {
        if (username != "") {
            isLogin((prev) => {
                return !prev
            })
            setCurrentUserName(username)
            socket.emit('user_list', { username })
            socket.emit('username', { username });
        }
        else {
            alert("Please type in a username")
        }
    }

    useEffect(() => {
        socket.on('user_list', (data) => {
            console.log('User list event received!');
            console.log(data);
            setUserList(data.users);
        });
        return () => {
            // This function will only be run when the component unmounts
            socket.emit('logout', { currentUser }) // your data here }});
        }
    })
    return (
        <div>
            {userList.map((user) => <li> {user} </li>)}
            <h1 className="game"> Tic-Tac-Toe</h1>
            {currentUser && <h4 className="current">Your Username: {currentUser}</h4>}
            {login ?
                (<Board currentUser={currentUser}/>):
                <Login signin={signin}/>}
        </div>
    );
}

export default App;
