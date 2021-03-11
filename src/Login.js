import { React, useRef } from 'react';
import PropTypes from 'prop-types';
import './styles/Login.css';

export default function Login({ signin }) {
  const user = useRef(null);
  return (
    <div className="login">
      <input
        className="login_input"
        ref={user}
        id="username"
        type="text"
        autoComplete="off"
      />
      <button
        type="submit"
        className="login_button"
        onClick={() => signin(user.current.value)}
      >
        Log-In
      </button>
    </div>
  );
}

Login.propTypes = {
  signin: PropTypes.func.isRequired
};
