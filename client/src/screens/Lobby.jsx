import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
      (data) => {
          const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

    return (

        <div className='homepage-container'>
      <form onSubmit={handleSubmitForm}>
      <div className='input-container'>
        <label htmlFor="email">Enter Username</label>
          <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
        <label htmlFor="room">Enter Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}/>
        <button>Submit</button>
                                     
       </div>
      </form>
         
      </div>
     
  );
};

export default LobbyScreen;
