import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import Chats from "./Chats";
const socket = io("http://localhost:8080");

function App() {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [isJoined, setIsjoined] = useState<boolean>(false);

  // useEffect(() => {
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (name.trim() === "" || room.trim() === "") {
      alert("Please enter a valid name and room");
      return;
    }

    socket.emit("join_room", { name, room });
    setIsjoined(true);
    alert("Joined");
  };

  return (
    <div className="container">
      {!isJoined ? (
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <h2 className="heading__primary">Chat App</h2>
          <div className="field-box">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field-box">
            <label htmlFor="room">Room</label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <button type="submit" className="join-btn">
            Join room
          </button>
        </form>
      ) : (
        <Chats socket={socket} name={name} room={room} />
      )}
    </div>
  );
}

export default App;
