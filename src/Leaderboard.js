import { React, useState, useEffect } from 'react'
import './styles/Leaderboard.css';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Leaderboard({ userList }) {
    // let [userList, setUserList] = useState([]);
    
    // useEffect(() => {
    //     console.log("BEFORE")
    //     socket.on('user_list', (data) => {
    //         console.log("INNER")
    
    //         console.log('User list event received!');
    //         console.log(data);
    //         setUserList(data.users)
    //     });
    //     console.log("AFTER")
    
    // }, []);
    return (
        <table>
            <thead>
                <tr>
                    <th colSpan="2">Leaderboard</th>
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
    )
}
