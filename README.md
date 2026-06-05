 Chat App Frontend

A real-time chat application built with React and Socket.IO. Features include instant messaging, typing indicators, message read receipts, emoji support, reply threads, message editing/deletion, and profanity filtering.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-black?logo=socketdotio)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap)

---
Live Link: https://chat-app-frontend-three-umber.vercel.app

 Features

- **Real-time messaging** — Instant message delivery powered by Socket.IO
- **Typing indicators** — See when the other person is typing
- **Message status tracking** — Sending → Sent → Delivered → Read (with tick indicators)
- **Emoji picker** — Built-in emoji keyboard for expressive conversations
- **Reply to messages** — Quote and reply to specific messages in the chat
- **Edit messages** — Edit your sent messages with an "edited" indicator
- **Delete messages** — Soft-delete your messages (shown as "This message was deleted")
- **Unread count badges** — See how many unread messages you have per contact
- **Profanity filter** — Abusive language is automatically censored on the backend
- **User authentication** — Register and login with username/password (bcrypt + JWT)
- **Responsive UI** — Mobile-friendly layout with Bootstrap 5

---

 Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| UI         | React 19, Bootstrap 5             |
| Routing    | React Router DOM v7               |
| Real-time  | Socket.IO Client                  |
| HTTP       | Axios                             |
| Emojis     | emoji-picker-react                |

---

 Project Structure

```
src/
├── App.js                  # Routes and app shell
├── components/
│   ├── Register.js         # User registration page
│   ├── Login.js            # User login page
│   ├── Chat.js             # Main chat interface (users list + message area)
│   ├── MessageList.js      # Renders messages with status, replies, actions
│   └── chat.css            # Chat-specific styles
├── styles.css
├── index.js
└── index.css
```

---

 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or above recommended)
- The backend server running (see [Backend Repository](#-backend-repository))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tanaymurade74/ChatAppFrontend.git
   cd ChatAppFrontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_URL=https://chatappbackend-1-gglp.onrender.com
   ```

   Replace the URL with your backend server address if different.

4. **Start the development server**

   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000).

---

##  Backend Repository

The backend for this app is built with Express, MongoDB, and Socket.IO.

👉 **[ChatAppBackend on GitHub](https://github.com/tanaymurade74/ChatAppBackend)**

### Backend Tech Stack

- Express 5
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- bcrypt for password hashing
- Obscenity (profanity filtering)

Refer to the backend repo's README for setup instructions.

---

## 📡 API Endpoints (Backend)

| Method   | Endpoint          | Description                     |
| -------- | ----------------- | ------------------------------- |
| `POST`   | `/auth/register`  | Register a new user             |
| `POST`   | `/auth/login`     | Login with credentials          |
| `GET`    | `/users`          | Get all users (with unread count) |
| `GET`    | `/messages`       | Fetch messages between two users |
| `PATCH`  | `/messages/:id`   | Edit a message                  |
| `DELETE` | `/messages/:id`   | Soft-delete a message           |

### Socket Events

| Event                | Direction       | Description                          |
| -------------------- | --------------- | ------------------------------------ |
| `send_message`       | Client → Server | Send a new message                   |
| `receive_message`    | Server → Client | Receive a new message                |
| `message_saved`      | Server → Client | Confirmation with real DB ID         |
| `message_delivered`  | Client → Server | Mark message as delivered             |
| `mark_chat_read`     | Client → Server | Mark all messages in a chat as read  |
| `mark_all_delivered` | Client → Server | Mark offline messages as delivered   |
| `typing`             | Client → Server | Notify typing started                |
| `stop_typing`        | Client → Server | Notify typing stopped                |
| `message_edited`     | Server → Client | Broadcast edited message             |
| `message_deleted`    | Server → Client | Broadcast deleted message            |

---

## 📜 Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm start`     | Run the app in development mode      |
| `npm run build` | Build for production                 |
| `npm test`      | Run tests                            |
| `npm run eject` | Eject from Create React App (one-way)|


---

## 👤 Author

**Tanay Murade**  
GitHub: [@tanaymurade74](https://github.com/tanaymurade74)
