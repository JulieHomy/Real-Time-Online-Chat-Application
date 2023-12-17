import React, { useState, useEffect } from "react";
import { LOGIN_STATUS, CLIENT, SERVER } from "./constants";
import {
  fetchSession,
  fetchLogout,
  fetchOnlineUsers,
  fetchLogin,
  fetchMessages,
} from "./services";
import Login from "./Login";
import Chat from "./Chat";
import Status from "./Status";
import Loading from "./Loading";
import Controls from "./Controls";

import './App.css';

function App() {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.PENDING);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  function onLogin(username) {
    fetchLogin(username)
      .then(() => {
        setUsername(username);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setError("");
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
      });
  }

  function onLogout() {
    setError("");
    setUsername("");
    setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
    setMessages([]);
    setOnlineUsers([]);
    fetchLogout().catch((err) => {
      setError(err?.error || "ERROR");
    });
  }

  function onRefresh() {
    setError("");

    fetchOnlineUsers()
      .then((data) => {
        setOnlineUsers(data.onlineUsers);
      })
      .catch((error) => {
        setError(error?.error || CLIENT.NETWORK_ERROR);
        console.error("Error fetching online users:", error);
      });

    fetchMessages()
      .then((response) => {
        setMessages(response);
      })
      .catch((error) => {
        setError(error?.error || CLIENT.NETWORK_ERROR);
        console.error("Error fetching messages:", error);
      });
  }

  useEffect(() => {
    fetchSession()
      .then((session) => {
        setUsername(session.username);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setError("");
      })
      .catch((err) => {
        if (err?.error === SERVER.AUTH_MISSING) {
          return Promise.reject({ error: CLIENT.NO_SESSION });
        }
        return Promise.reject(err);
      })
      .then(() => {
        onRefresh();
      })
      .catch((err) => {
        if (err?.error === CLIENT.NO_SESSION) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        }
        setError(err?.error || "ERROR");
      });
  }, []);


  return (
    <div className="app">
      <main className="main">
        {error && <Status error={error} />}
        {loginStatus === LOGIN_STATUS.PENDING && (
          <Loading className="login-waiting">Loading user...</Loading>
        )}
        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && (
          <Login onLogin={onLogin} />
        )}

        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <div>
            <Controls onLogout={onLogout} onRefresh={onRefresh} />
            <Chat
              username={username}
              messages={messages}
              onlineUsers={onlineUsers}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;