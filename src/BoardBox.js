import { React, useState, useEffect } from 'react';
import './styles/Board.css';
import PropTypes from 'prop-types';
import { socket } from './App';

export default function BoardBox({
  onClickButton,
  value,
  winner,
  currentUser,
}) {
  const [player, setPlayer] = useState(false);

  const helperClick = () => {
    if (player) {
      if (!winner) {
        onClickButton();
      }
    }
  };
  useEffect(() => {
    socket.on('username', (data) => {
      if (currentUser === data.X || currentUser === data.O) {
        setPlayer(true);
      }
    });
  });

  return (
    <div
      className="box"
      onClick={helperClick}
      onKeyDown={helperClick}
      role="button"
      tabIndex="0"
    >
      {value}
    </div>
  );
}

BoardBox.propTypes = {
  onClickButton: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  winner: PropTypes.bool.isRequired,
  currentUser: PropTypes.string.isRequired,
};
