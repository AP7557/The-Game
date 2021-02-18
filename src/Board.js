import { React, useState } from 'react'
import './styles/Board.css';
import { BoardBox } from './BoardBox.js'

export function Board() {
    const [board, setBoard] = useState(Array(9).fill(null));
    let [OX, setOX] = useState(1);

    const onClickButton = (id) => {
        let userClick = [...board]
        if (!userClick[id]) {
            userClick[id] = (OX == 1) ? 'X' : 'O'
            setOX(!OX)
        }
        setBoard(userClick)
    }
    return (
        <div className="board" >
        {board.map((value, i)=><BoardBox value={value} onClickButton={()=>onClickButton(i)}/>)}
        </div>
    )
}
