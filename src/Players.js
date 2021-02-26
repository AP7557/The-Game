import { React, useState, useEffect } from 'react'
import './styles/Players.css';

export function Players({ player, i }) {
    if (i == 0) {
        return <li className="Px">Player X: {player}</li>
    }
    else if (i == 1) {
        return <li className="Po">Player O: {player}</li>
    }
    else {
        return <li className="Ps"> Spectors: { player } </li>
    }
}
