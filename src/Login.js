import { React, useRef } from 'react'
import './styles/Login.css'

export function Login({ signin }) {
    const user = useRef(null)
    return (
        <div className="login">
            <input className="login_input" ref={user} id="username" type="text" autoComplete="off"/>
            <button className="login_button" onClick={()=>signin(user.current.value)}>Log-In</button>
        </div>
    );
}
