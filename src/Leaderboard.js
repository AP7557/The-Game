import { React, useState, useEffect } from 'react'
import './styles/Leaderboard.css';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Leaderboard({ userList }) {
    return (<div>{ console.log(userList) }
        <table>
            <thead>
                <tr>
                    <th colspan="2">Leaderboard</th>
                </tr>
            </thead>
            <tbody>
                {userList.map(user => <tr>
                        <td>{user.username}</td>
                        <td>{user.score}</td>
                    </tr>
                )}
            </tbody>
        </table>
        </div>)
}
