import { React, useState, useEffect } from 'react';
import './styles/Board.css';
import PropTypes from 'prop-types';
import BoardBox from './BoardBox';
import getWinnerFunction from './Winner';
import Leaderboard from './Leaderboard';
import { socket } from './App';

export default function Board({ currentUser }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [OXs, setOXs] = useState('X');
  const [winner, setWinner] = useState({ isWinner: false, userWinner: '' });
  const [allPlayers, setAllPlayers] = useState({ X: '', O: '', spec: [] });
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const onClickButton = (id) => {
    const userClick = [...board];
    if (!userClick[id]) {
      if (currentUser === allPlayers[OXs]) {
        userClick[id] = OXs;
        setBoard(userClick);
        const status = getWinnerFunction(userClick);
        if (status) {
          if (status === 'X') {
            socket.emit('winner', {
              winner: allPlayers.X,
              loser: allPlayers.O
            });
          } else if (status === 'O') {
            socket.emit('winner', {
              winner: allPlayers.O,
              loser: allPlayers.X
            });
          }
        }
        socket.emit('click', { message: userClick, OXs, allPlayers });
      }
    }
  };
  const onReset = () => {
    const userClick = [...board];
    userClick.fill(null);
    socket.emit('reset', { message: userClick, OXs: 'X', winner: false });
  };

  useEffect(() => {
    socket.on('username', (data) => {
      Object.keys(data).map((item) => setAllPlayers((prev) => ({
        ...prev,
        [item]: data[item]
      })));
    });
    socket.on('click', (data) => {
      const userClick = [...data.message];
      setAllPlayers(data.allPlayers);
      setBoard(userClick);
      const status = getWinnerFunction(userClick);
      if (status) {
        if (status === 'X') {
          setWinner({
            isWinner: true,
            userWinner: data.allPlayers.X
          });
        } else if (status === 'O') {
          setWinner({
            isWinner: true,
            userWinner: data.allPlayers.O
          });
        } else if (status === 'Draw') {
          setWinner({ isWinner: true, userWinner: 'DRAW' });
        }
      }
      setOXs(() => {
        if (data.OXs === 'X') {
          return 'O';
        }
        if (data.OXs === 'O') {
          return 'X';
        }
        return 'X';
      });
    });
    socket.on('reset', (data) => {
      const userClick = [...data.message];
      setBoard(userClick);
      setWinner({ isWinner: data.winner, userWinner: '' });
      setOXs(data.OXs);
    });
  }, []);

  return (
    <div>
      {winner.isWinner && (
        <h1 className="winner">
          Winner:
          {winner.userWinner}
        </h1>
      )}
      <div className="window">
        <div className="col">
          <li className="Px">
            Player X:
            {allPlayers.X}
          </li>
          <li className="Po">
            Player O:
            {allPlayers.O}
          </li>
          {allPlayers.spec.map((player) => (
            <li className="Ps">
              Spectors:
              {player}
            </li>
          ))}
        </div>
        <div className="col">
          {(currentUser === allPlayers.X || currentUser === allPlayers.O)
            && winner.isWinner && (
              <button type="button" className="reset_button" onClick={onReset}>
                Reset
              </button>
          )}
          <h4>
            Current Player:
            {allPlayers[OXs]}
          </h4>
          <div className="board">
            {board.map((value, i) => (
              <BoardBox
                key={i}
                currentUser={currentUser}
                value={value}
                winner={winner.isWinner}
                onClickButton={() => onClickButton(i)}
              />
            ))}
          </div>
        </div>
        <div className="col">
          <button
            type="button"
            className="SHLeaderboard"
            onClick={() => {
              setShowLeaderboard((prev) => !prev);
            }}
          >
            {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
          </button>
          {showLeaderboard && <Leaderboard currentUser={currentUser} />}
        </div>
      </div>
    </div>
  );
}

Board.propTypes = {
  currentUser: PropTypes.string.isRequired
};
