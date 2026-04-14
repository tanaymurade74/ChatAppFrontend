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

    if (user) fetchUsers();

    socket.on("receive_message", (data) => {
      if (data.receiver === user) {
        socket.emit("message_delivered", { messageId: data._id });
      }
      if (data.sender === currentChat) {
        setMessages((prev) => [...prev, data]);
        
        socket.emit("mark_chat_read", { 
            sender: data.sender, 
            receiver: user 
        });
      }
    });

    socket.on("message_saved", (data) => {
      setMessages((prev) => prev.map((msg) => 
        msg.tempId === data.tempId ? { ...msg, _id: data.realId, status: "sent" } : msg
      ));
    });

    socket.on("status_updated_to_delivered", (data) => {
      setMessages((prev) => prev.map((msg) => 
        msg._id === data.messageId ? { ...msg, status: "delivered" } : msg
      ));
    });

    socket.on("chat_read_by_user", (data) => {
      if (data.reader === currentChat) {
        setMessages((prev) => prev.map((msg) => 
          msg.sender === user ? { ...msg, status: "read" } : msg
        ));
      }
    });

    socket.on("user_typing", data => {
      if(data.sender === currentChat) setIsTyping(true);
    });

    socket.on("user_stopped_typing", data => {
      if(data.sender === currentChat) setIsTyping(false);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_saved");
      socket.off("status_updated_to_delivered");
      socket.off("chat_read_by_user");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [currentChat, user]);

  useEffect(() => {
    if(!currentMessage || !currentMessage.trim() || !currentChat) return;

    socket.emit("typing", {sender: user, receiver: currentChat});

    const timeoutId = setTimeout(() => {
      socket.emit("stop_typing", {sender: user, receiver: currentChat});
    }, 1000);

    return () => clearTimeout(timeoutId);

  }, [currentChat, currentMessage, user]);

  const fetchMessages = async (receiver) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/messages`, {
        params: { sender: user, receiver },
      });
      setMessages(data);
      setCurrentChat(receiver);

      socket.emit("mark_chat_read", { sender: receiver, receiver: user });
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setCurrentMessage((prev) => prev + emojiObject.emoji);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return; 

    const tempId = Date.now().toString(); 
    const messageData = {
      tempId,
      sender: user,
      receiver: currentChat,
      message: currentMessage,
      status: "sending"
    };
    
    socket.emit("send_message", messageData);
    messageData.createdAt = new Date().toISOString();
    
    setMessages((prev) => [...prev, messageData]);
    setCurrentMessage("");
    setShowEmojiPicker(false); 

    socket.emit("stop_typing", { sender: user, receiver: currentChat });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="chat-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Welcome, {user}</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="chat-list">
        <h3>Chats</h3>
        {users.map((u) => (
          <div
            key={u._id}
            className={`chat-user ${currentChat === u.username ? "active" : ""}`}
            onClick={() => fetchMessages(u.username)}
          >
            {u.username}
          </div>
        ))}
      </div>
      {currentChat && (
        <div className="chat-window">
          <h5>You are chatting with {currentChat}</h5>
          
          <MessageList messages={messages} user={user} />
          
          <div className="message-field" style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
            
            {showEmojiPicker && (
              <div style={{ position: "absolute", bottom: "100%", left: "0", zIndex: 100, marginBottom: "10px" }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            <button 
              type="button" 
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer", padding: "0" }}
            >
              😀
            </button>

            <input
              type="text"
              placeholder="Type a message..."
              value={currentMessage}
              style={{ minWidth: "400px", flex: 1 }}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            
            <button className="btn-prime" onClick={sendMessage}>
              Send
            </button>
          </div>
          
          {isTyping && <div style={{ marginTop: "5px", fontSize: "0.8rem", color: "gray" }}>{currentChat} is typing...</div>}
          
        </div>
      )}
    </div>
  );
};