

const MessageList = ({ messages, user }) => {

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
  };

  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        const isMe = msg.sender === user;
        
        const timeToDisplay = msg.createdAt; 

        return (
          <div key={index} className={`message ${isMe ? "sent" : "received"}`}>
            <div style={{ marginBottom: "2px" }}>{msg.message}</div>
            
            <div style={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                alignItems: "center", 
                gap: "5px", 
                marginTop: "4px" 
            }}>
              
              <span style={{ 
                  fontSize: "10px", 
                  color: isMe ? "rgba(0,0,0,0.5)" : "gray" 
              }}>
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
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;