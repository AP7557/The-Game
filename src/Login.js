import { React, useState, useEffect, useRef } from 'react'

export function Login({ signin }) {
    const user = useRef(null)
    return (
        <div>
            <input ref={user} id="username" type="text"/>
            <button onClick={()=>signin(user.current.value)}>Log-In</button>
        </div>
    );
}
