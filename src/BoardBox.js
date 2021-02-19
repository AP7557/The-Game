import { React } from 'react'
import './styles/Board.css';

export function BoardBox({ onClickButton, value }) {
    return (
        <div className="box" onClick={onClickButton}>{value}</div>
    )
}
