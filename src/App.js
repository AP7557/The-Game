import logo from './logo.svg';
import { React, useState, useEffect } from 'react'
import './styles/App.css';
import { Board } from './Board.js'
import { Login } from './Login.js'

function App() {
  let [login, isLogin] = useState(false)
  let [user, setUser] = useState()

  const signin = (username) => {
    setUser(username)
    isLogin(!login)
    console.log(user)
  }

  return (
    <div className="App-header">
      {login ? <Board user={user}/> : <Login signin={signin}/>}
    </div>
  );
}

export default App;
