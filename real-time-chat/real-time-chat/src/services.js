const onlineUsersState = {
    onlineUsers: [],
  
    updateOnlineUsers(users) {
      this.onlineUsers = users;
    },
  };
  
  export function fetchLogin(username) {
    return fetch("/api/session", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify({ username }),
    })
      .catch(() => Promise.reject({ error: "networkError" }))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json()
          .catch((error) => Promise.reject({ error }))
          .then((err) => Promise.reject(err));
      })
      .then((data) => {
        if (data && data.onlineUsers) {
          onlineUsersState.updateOnlineUsers(data.onlineUsers);
        }
        return data;
      });
  }
  
  export function fetchLogout() {
    return fetch("/api/session", {
      method: "DELETE",
    })
      .catch(() => Promise.reject({ error: "networkError" }))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json()
          .catch((error) => Promise.reject({ error }))
          .then((err) => Promise.reject(err));
      })
      .then((data) => {
        if (data && data.onlineUsers) {
          onlineUsersState.updateOnlineUsers(data.onlineUsers);
        }
        return data;
      });
  }
  
  export function fetchOnlineUsers() {
    return fetch("/api/users")
      .then((response) => response.json())
      .catch(() => Promise.reject({ error: "networkError" }));
  }
  
  setInterval(() => {
    fetchOnlineUsers().then((data) => {
      if (data && data.onlineUsers) {
        onlineUsersState.updateOnlineUsers(data.onlineUsers);
      }
    });
  }, 5000);
  
  export function sendMessage(messageContent) {
    return fetch("/api/messages", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(messageContent),
    })
      .catch(() => Promise.reject({ error: "networkError" }))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response
          .json()
          .catch((error) => Promise.reject({ error }))
          .then((err) => Promise.reject(err));
      });
  }
  
  export function fetchMessages() {
    return fetch("/api/messages")
      .catch(() => Promise.reject({ error: "networkError" }))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response
          .json()
          .catch((error) => Promise.reject({ error }))
          .then((err) => Promise.reject(err));
      });
  }
  
  export function checkSession() {
    return fetch("/api/session")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject({ error: "no-session" });
      })
      .catch((error) => Promise.reject(error));
  }
  
  export function fetchSession() {
    return fetch("/api/session", {
      method: "GET",
    })
      .catch(() => Promise.reject({ error: "networkError" }))
      .then((response) => {
        console.log("api/session", response);
        if (response.ok) {
          return response.json();
        }
        return response
          .json()
          .catch((error) => Promise.reject({ error }))
          .then((err) => Promise.reject(err));
      });
  }