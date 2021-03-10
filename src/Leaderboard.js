import { React, useState, useEffect } from 'react';
import './styles/Leaderboard.css';
import { socket } from './App.js';

export function Leaderboard({ currentUser }) {
	let [userList, setUserList] = useState([]);

	useEffect(() => {
		socket.emit('printdb');
		socket.on('user_list', (data) => {
			setUserList(data.users);
		});
	}, []);
	return (
		<table>
			<thead>
				<tr>
					<th colSpan="2">Leaderboard</th>
				</tr>
			</thead>
			<tbody>
				{userList.map((user) => (
					<tr
						className={
							user.username === currentUser ? 'currentLB' : 'regularLB'
						}
					>
						<td>{user.username}</td>
						<td>{user.score}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
