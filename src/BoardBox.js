import { React, useState, useEffect } from 'react';
import './styles/Board.css';
import { socket } from './App.js';

export function BoardBox({ onClickButton, value, winner, currentUser }) {
	let [player, setPlayer] = useState(false);

	const helperClick = () => {
		if (player) {
			if (!winner) {
				onClickButton();
			}
		}
	};
	useEffect(() => {
		socket.on('username', (data) => {
			if (currentUser === data['X'] || currentUser === data['O']) {
				setPlayer(true);
			}
		});
	});

	return (
		<div className="box" onClick={helperClick}>
			{value}
		</div>
	);
}
