const MessageList = ({ messages, user, onReply, onEdit, onDelete }) => {
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const canEdit = (msg) =>
    msg.sender === user && !msg.deletedAt 

  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        const isMe = msg.sender === user;
        const isDeleted = !!msg.deletedAt;

        return (
          <div
            key={msg._id || msg.tempId || index}
            className={`message ${isMe ? "sent" : "received"} message-row`}
          >
            {msg.replyTo && !isDeleted && (
              <div
                style={{
                  borderLeft: "3px solid #0d6efd",
                  paddingLeft: "8px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  marginBottom: "6px",
                  fontSize: "12px",
                  opacity: 0.85,
                  backgroundColor: isMe
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(0,0,0,0.04)",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    color: isMe ? "rgba(0,0,0,0.7)" : "#0d6efd",
                  }}
                >
                  {msg.replyTo.sender === user ? "You" : msg.replyTo.sender}
                </div>
                <div className="text-truncate" style={{ maxWidth: "240px" }}>
                  {msg.replyTo.deletedAt ? (
                    <em>Deleted message</em>
                  ) : (
                    msg.replyTo.message
                  )}
                </div>
              </div>
            )}

            {isDeleted ? (
              <div
                style={{
                  fontStyle: "italic",
                  opacity: 0.6,
                  marginBottom: "2px",
                }}
              >
                🚫 This message was deleted
              </div>
            ) : (
              <div style={{ marginBottom: "2px" }}>{msg.message}</div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "5px",
                marginTop: "4px",
              }}
            >
              {msg.editedAt && !isDeleted && (
                <span
                  style={{
                    fontSize: "10px",
                    opacity: 0.6,
                    fontStyle: "italic",
                  }}
                >
                  edited
                </span>
              )}
              <span
                style={{
                  fontSize: "10px",
                  color: isMe ? "rgba(0,0,0,0.5)" : "gray",
                }}
              >
                {formatTime(msg.createdAt)}
              </span>

              {isMe && !isDeleted && (
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {msg.status === "sending" && <span style={{ color: "gray" }}>⏱</span>}
                  {msg.status === "sent" && <span style={{ color: "gray" }}>✓</span>}
                  {msg.status === "delivered" && <span style={{ color: "gray" }}>✓✓</span>}
                  {msg.status === "read" && <span style={{ color: "#34B7F1" }}>✓✓</span>}
                </span>
              )}
            </div>

            {msg._id && !isDeleted && (
              <div className="message-actions">
                <button
                  className="action-btn"
                  title="Reply"
                  onClick={() => onReply(msg)}
                >
                  ↩
                </button>
                {canEdit(msg) && (
                  <button
                    className="action-btn"
                    title="Edit"
                    onClick={() => onEdit(msg)}
                  >
                    ✏️
                  </button>
                )}
                {isMe && (
                  <button
                    className="action-btn"
                    title="Delete"
                    onClick={() => onDelete(msg)}
                  >
                    🗑️
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;