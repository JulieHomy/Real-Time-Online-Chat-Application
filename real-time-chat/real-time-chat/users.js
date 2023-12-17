const users = {};

function isValid(username) {
  let isValid = true;
  isValid = !!username && username.trim();
  isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
  return isValid;
}

function addUser(username) {
  users[username] = { online: true };
}

function removeUser(username) {
  delete users[username];
}

function isUserOnline(username) {
  return users[username]?.online;
}

function getOnlineUsers() {
  return Object.keys(users).filter((username) => users[username].online);
}

module.exports = {
  isValid,
  addUser,
  removeUser,
  isUserOnline,
  getOnlineUsers,
};