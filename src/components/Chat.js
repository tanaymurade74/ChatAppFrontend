import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import MessageList from "./MessageList";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";

const socket = io(`${process.env.REACT_APP_API_URL}`);

export const Chat = () => {
  const param = useParams();
  const user = param.username;
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); 

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
          params: { currentUser: user },
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    if (user) {
      fetchUsers();
      socket.emit("mark_all_delivered", user);
    }

    socket.on("receive_message", (data) => {
      if (data.receiver === user) {
        socket.emit("message_delivered", { messageId: data._id });
      }

      if (data.sender === currentChat) {
        setMessages((prev) => [...prev, data]);
        socket.emit("mark_chat_read", {
          sender: data.sender,
          receiver: user,
        });
      } else if (data.receiver === user) {
        setUsers((prevUsers) =>
          prevUsers.map((us) =>
            us.username === data.sender
              ? { ...us, unreadCount: (us.unreadCount || 0) + 1 }
              : us
          )
        );
      }
    });

    socket.on("message_saved", (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === data.tempId
            ? { ...msg, _id: data.realId, status: "sent" }
            : msg
        )
      );
    });

    socket.on("status_updated_to_delivered", (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, status: "delivered" } : msg
        )
      );
    });

    socket.on("chat_read_by_user", (data) => {
      if (data.reader === currentChat && data.chatWith === user) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === user ? { ...msg, status: "read" } : msg
          )
        );
      }
    });

    socket.on("user_came_online", (onlineUser) => {
      if (onlineUser === currentChat) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === user && msg.status === "sent"
              ? { ...msg, status: "delivered" }
              : msg
          )
        );
      }
    });

    socket.on("user_typing", (data) => {
      if (data.sender === currentChat) setIsTyping(true);
    });

    socket.on("user_stopped_typing", (data) => {
      if (data.sender === currentChat) setIsTyping(false);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_saved");
      socket.off("status_updated_to_delivered");
      socket.off("chat_read_by_user");
      socket.off("user_came_online");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [currentChat, user]);

  useEffect(() => {
    if (!currentMessage || !currentMessage.trim() || !currentChat) return;

    socket.emit("typing", { sender: user, receiver: currentChat });

    const timeoutId = setTimeout(() => {
      socket.emit("stop_typing", { sender: user, receiver: currentChat });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentChat, currentMessage, user]);

  useEffect(() => {
    setReplyingTo(null);
  }, [currentChat]);

  const fetchMessages = async (receiver) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/messages`, {
        params: { sender: user, receiver },
      });
      setMessages(data);
      setCurrentChat(receiver);

      setUsers((prevUsers) =>
        prevUsers.map((us) =>
          us.username === receiver ? { ...us, unreadCount: 0 } : us
        )
      );

      socket.emit("mark_chat_read", { sender: receiver, receiver: user });
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setCurrentMessage((prev) => prev + emojiObject.emoji);
  };

  const handleReply = (msg) => {
    setReplyingTo(msg);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const tempId = Date.now().toString();
    const messageData = {
      tempId,
      sender: user,
      receiver: currentChat,
      message: currentMessage,
      replyTo: replyingTo?._id || null,
      status: "sending",
    };

    socket.emit("send_message", messageData);
    messageData.createdAt = new Date().toISOString();

    if (replyingTo) {
      messageData.replyTo = {
        _id: replyingTo._id,
        sender: replyingTo.sender,
        message: replyingTo.message,
      };
    }

    setMessages((prev) => [...prev, messageData]);
    setCurrentMessage("");
    setReplyingTo(null);
    setShowEmojiPicker(false);

    socket.emit("stop_typing", { sender: user, receiver: currentChat });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user}</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row">
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Chats</h5>
            </div>
            <div
              className="list-group list-group-flush"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              {users.map((u) => (
                <button
                  key={u._id}
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    currentChat === u.username ? "active" : ""
                  }`}
                  onClick={() => fetchMessages(u.username)}
                >
                  {u.username}

                  {u.unreadCount > 0 && (
                    <span className="badge bg-danger rounded-pill">
                      {u.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8 col-lg-9">
          {currentChat ? (
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="mb-0">You are chatting with {currentChat}</h5>
              </div>

              <div
                className="card-body d-flex flex-column"
                style={{ height: "60vh", overflowY: "auto" }}
              >
                <MessageList
                  messages={messages}
                  user={user}
                  onReply={handleReply}
                />
                {isTyping && (
                  <div className="text-muted small mt-2">
                    {currentChat} is typing...
                  </div>
                )}
              </div>

              <div className="card-footer bg-white position-relative">
                {replyingTo && (
                  <div className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light border-4 rounded">
                    <div className="flex-grow-1 me-2" style={{ minWidth: 0 }}>
                      <div className="small text-primary fw-bold">
                        Replying to{" "}
                        {replyingTo.sender === user ? "yourself" : replyingTo.sender}
                      </div>
                      <div className="small text-muted text-truncate">
                        {replyingTo.message}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Cancel reply"
                      onClick={() => setReplyingTo(null)}
                    />
                  </div>
                )}

                {showEmojiPicker && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      left: "0",
                      zIndex: 100,
                      marginBottom: "10px",
                    }}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}

                <div className="input-group">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    😀
                  </button>

                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      replyingTo ? `Reply to ${replyingTo.sender}...` : "Type a message..."
                    }
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                      if (e.key === "Escape" && replyingTo) setReplyingTo(null);
                    }}
                  />

                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-secondary text-center" role="alert">
              Please select a user from the list to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};