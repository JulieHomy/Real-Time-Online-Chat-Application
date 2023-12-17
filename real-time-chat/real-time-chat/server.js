const express = require("express");
const cookieParser = require("cookie-parser");

const sessions = require("./sessions");
const chatUsers = require("./chatUsers");
const users = require("./users");
const app = express();

app.use(cookieParser());
app.use(express.static("./dist"));
app.use(express.json());

const PORT = process.env.PORT || 3000;

let messages = [];

app.get("/api/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  res.json({ username });
});

app.post("/api/session", (req, res) => {
  const { username } = req.body;

  if (!users.isValid(username)) {
    res.status(400).json({ error: "required-username" });
    return;
  }

  if (username === "dog") {
    res.status(403).json({ error: "auth-insufficient" });
    return;
  }

  const sid = sessions.addSession(username);
  chatUsers.addChatUser(username);
  res.cookie("sid", sid);
  res.json({ username, onlineUsers: chatUsers.getOnlineChatUsers() });
});

app.delete("/api/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (sid) {
    sessions.deleteSession(sid);
    chatUsers.removeChatUser(username);
    res.clearCookie("sid");
  }
  res.json({
    message: "Logged out",
    onlineUsers: chatUsers.getOnlineChatUsers(),
  });
});

app.get('/api/users', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  try {
    const onlineUsers = chatUsers.getOnlineChatUsers();
    res.json({ onlineUsers });
  } catch (error) {
    res.status(500).json({ error: 'internal-server-error' });
  }
});

app.post("/api/messages", (req, res) => {
  const { text, sender } = req.body;
  if (!chatUsers.isChatUserOnline(sender)) {
    res.status(403).json({ error: "user-not-online" });
    return;
  }
  const message = { text, sender, timestamp: new Date().toISOString() };
  messages.push(message);
  res.json(message);
});

app.get('/api/messages', (req, res) => {
  try {
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'internal-server-error' });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);