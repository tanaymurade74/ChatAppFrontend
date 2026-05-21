const MessageList = ({ messages, user, onReply }) => {
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        const isMe = msg.sender === user;
        const timeToDisplay = msg.createdAt;

        return (
          <div
            key={msg._id || msg.tempId || index}
            className={`message ${isMe ? "sent" : "received"} message-row`}
          >
            {msg.replyTo && (
              <div
                style={{
                  borderLeft: "3px",
                  paddingLeft: "8px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  marginBottom: "6px",
                  fontSize: "12px",
                  // opacity: 0.85,
                  backgroundColor: isMe
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(0,0,0,0.04)",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{ maxWidth: "240px" }}
                >
                  {msg.replyTo.message}
                </div>
              </div>
            )}

            <div style={{ marginBottom: "2px" }}>{msg.message}</div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "5px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: isMe ? "rgba(0,0,0,0.5)" : "gray",
                }}
              >
                {formatTime(timeToDisplay)}
              </span>

              {isMe && (
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {msg.status === "sending" && <span style={{ color: "gray" }}>⏱</span>}
                  {msg.status === "sent" && <span style={{ color: "gray" }}>✓</span>}
                  {msg.status === "delivered" && <span style={{ color: "gray" }}>✓✓</span>}
                  {msg.status === "read" && <span style={{ color: "#34B7F1" }}>✓✓</span>}
                </span>
              )}
            </div>

            {msg._id && (
              <button
                className="reply-btn "
                title="Reply"
                onClick={() => onReply(msg)}
              >
                ↩
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;