import './Chat.css';
import React, { useState, useEffect } from "react";
import { CLIENT } from "./constants";
import {
  fetchLogout,
  sendMessage,
  fetchOnlineUsers,
  fetchMessages,
} from "./services";

function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = () => {
      Promise.all([fetchOnlineUsers(), fetchMessages()])
        .then(([onlineUsersData, messagesData]) => {
          setOnlineUsers(onlineUsersData.onlineUsers);
          setMessages(messagesData);
        })
        .catch((error) => {
          setError(error?.error || CLIENT.NETWORK_ERROR);
          console.error("Error fetching online users or messages:", error);
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);


  const handleMessageSend = () => {
    if (!inputMessage.trim()) {
      setError(CLIENT.NETWORK_ERROR);
      return;
    }

    sendMessage({ text: inputMessage, sender: username })
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, response]);
        setInputMessage("");
      })
      .catch((error) => {
        setError(error?.error || CLIENT.NETWORK_ERROR);
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="content">
      <h1 className="welcome">Hello, {username}!</h1>
      <p className="welcome-message">Let's connect and chat!</p>

      <div className="chat">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <p className="message-display">
              <strong>{message.sender}</strong>: {message.text}
            </p>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder='Please Type Your Message Here'
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
      <div className="online-users">
        <p className="online-user-list">Online Users:</p>
        <ul>
          {onlineUsers.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
}

export default Chat;