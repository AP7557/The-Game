import { React, useState } from 'react';
import './styles/App.css';
import io from 'socket.io-client';
import Board from './Board';
import Login from './Login';

export const socket = io(); // Connects to socket connection

function App() {
  const [login, isLogin] = useState(false);
  const [currentUser, setCurrentUserName] = useState('');

  const signin = (username) => {
    if (username !== '') {
      isLogin((prev) => !prev);
      setCurrentUserName(username);
      socket.emit('join', {
        username
      });
      socket.emit('username', {
        username
      });
    } else {
      alert('Please type in a username');
    }
  };

  const logout = () => {
    isLogin(false);
    setCurrentUserName('');
    socket.emit('logout', {
      currentUser
    });
  };

  return (
    <div>
      <h1 className="game"> Tic-Tac-Toe</h1>
      {login && (
        <button type="button" className="logout" onClick={logout}>
          Log-out
        </button>
      )}
      {currentUser && (
        <h4 className="current">
          Your Username:
          {currentUser}
        </h4>
      )}
      {login ? <Board currentUser={currentUser} /> : <Login signin={signin} />}
    </div>
  );
}

export default App;
