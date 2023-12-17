import { useState } from "react";
import './Login.css';
import chatImage from './images/logo.jpg';

function Login({ onLogin }) {
  const [username, setUsername] = useState("");

  function onChange(e) {
    setUsername(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  }

  return (
    <div className="login">
      <div className="login-header">
      <h1 className="login-title">Welcome to Walkie-Talkie!</h1>
        <img src={chatImage} alt="Login Image" className="login-image" />
      </div>
      <form className="login-form" action="#/login" onSubmit={onSubmit}>
        <label>
          <span className="username">Username:</span>
          <input
            className="login-username"
            type="text"
            value={username}
            onChange={onChange}
          />
        </label>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;