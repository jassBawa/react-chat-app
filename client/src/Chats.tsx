import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";

type MessageData = {
  room: string;
  name: string;
  message: string;
  time: string;
};

type chatProps = {
  socket: Socket;
};

function Chats({ socket, room, name }) {
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState("");

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const messageData: MessageData = {
      room,
      name,
      message,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    await socket.emit("send_message", messageData);
    setMessages([...messages, messageData]);

    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessages([...messages, data]);
    });
  }, [socket]);
  return (
    <div className="form chat-window">
      <h2 className="heading__primary">Chat App</h2>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messages.map((messageContent) => {
            return (
              <div
                className="message"
                id={name === messageContent.name ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          id="message"
          className="chat-input"
          value={message}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="button" className="chat-btn" onClick={sendMessage}>
          Send &#9658;
        </button>
      </div>
    </div>
  );
}

export default Chats;
