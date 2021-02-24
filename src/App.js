import logo from './logo.svg';
import { React, useState, useEffect } from 'react'
import './styles/App.css';
import { Board } from './Board.js'
import { Login } from './Login.js'
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  let [login, isLogin] = useState(false)

  const signin = (username) => {
    isLogin(!login)
    console.log(login)
    socket.emit('username', { user: username });
  }
  useEffect(() => {
    // Whatever regular useEffect code you have below...
    // …
    // Then return a function (can be called anything)
    return function cleanup() {
      // This function will only be run when the component unmounts
      socket.emit('logout', { user: "bue" }) // your data here }});
    }
  });


  return (
    <div className="App-header">
      {login ? <Board/> : <Login signin={signin}/>}
    </div>
  );
}

export default App;
