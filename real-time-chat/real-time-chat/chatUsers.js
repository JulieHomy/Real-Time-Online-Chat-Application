const chatUsers = new Map();

function addChatUser(username) {
  chatUsers.set(username, { online: true });
}

function removeChatUser(username) {
  chatUsers.delete(username);
}

function isChatUserOnline(username) {
  return chatUsers.get(username)?.online;
}

function getOnlineChatUsers() {
  return Array.from(chatUsers.keys()).filter(
    (username) => chatUsers.get(username).online
  );
}

module.exports = {
  addChatUser,
  removeChatUser,
  isChatUserOnline,
  getOnlineChatUsers,
};
