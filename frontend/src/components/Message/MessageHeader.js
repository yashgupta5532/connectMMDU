import React, { Fragment, useEffect, useState } from "react";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallIcon from "@mui/icons-material/Call";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Message.css";
import io from "socket.io-client";
import CloseFriend from "../closeFriend/CloseFriend.jsx";
import Online from "../online/Online.jsx";

const user = {
  name: "Yash GUpta",
  messages: ["hi", "Hleoo", "how much"],
  // message: "Hi from yash gupta",
  avatar:
    "https://imgs.search.brave.com/Sj83X2vIO7-OkgD9ifzhvVl_S-18fST7J2kr0m9FBiE/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMy8w/OS8yNS8yMC8xMS9i/b2F0LTgyNzU5NjJf/NjQwLmpwZw",
};

const socket = io("http://localhost:3000/message");

const MessageHeader = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("chat message", (msg) => {
      console.log("message sending", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("message in frontend",message);
    socket.emit("chat message", message);
    setMessage("");
  };

  return (
    <Fragment>
      <div className="main-message-container">
        <div className="friends-container">
          <h3 style={{marginBottom:"10px"}}>All Friends</h3><hr style={{marginBottom:"10px"}}/>
          <CloseFriend />
        </div>
        <div className="message-container">
          <div className="receiver-header-container">
            <div className="receiver-header-info">
              <div className="receiver-header">
                <div className="receiver-avatar">
                  <img src={user.avatar} alt="img" />
                </div>
                <div className="receiver-name">{user.name}</div>
              </div>
              <div className="side">
                <div className="video">
                  <VideoCallIcon />
                </div>
                <div className="audio">
                  <CallIcon />
                </div>
                <div className="search">
                  <SearchIcon />
                </div>
                <div className="dott">
                  <MoreVertIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Message body here  */}
          <div className="message-body-container">
            <div className="message ">
              <ul>
                {messages &&
                  messages.map((message, idx) => <li key={idx}>{message}</li>)}
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="send-message">
              <div className="take-input">
                <input
                  type="text"
                  placeholder="send message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="Submit">Send</button>
              </div>
            </div>
          </form>
        </div>
        <div className="online-user-container">
          <h3 style={{marginBottom:"10px"}}>online users</h3>
          <hr style={{marginBottom:"10px"}}/>
          <Online />
        </div>
      </div>
    </Fragment>
  );
};

export default MessageHeader;
