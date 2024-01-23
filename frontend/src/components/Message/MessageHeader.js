import React, { Fragment, useEffect, useState } from "react";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallIcon from "@mui/icons-material/Call";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import "./Message.css";
import { io } from "socket.io-client";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import CloseFriend from "../closeFriend/CloseFriend.jsx";
import Online from "../online/Online.jsx";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";

// const socket = io("http://localhost:8000");

const MessageHeader = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const alert = useAlert();

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/user/userDetails/${userId}`,
          {
            withCredentials: true,
          }
        );
        console.log("data profile ", data);
        if (data?.success) {
          setUser(data?.data);
        } else {
          // alert.error(data?.message);
        }
      } catch (error) {
        // alert.error(error);
      }
    };
    fetchMyInfo();
  }, [userId]);

  useEffect(() => {
    const fetchAllMessages = async () => {
      const { data } = await axios.get(`${serverUrl}/message/all/${userId}`, {
        withCredentials: true,
      });
      console.log("all messages ", data);
      if (data?.success) {
        setMessages(data?.data);
      } else {
        alert.error(data?.message);
      }
    };
    fetchAllMessages();
  }, [userId]);

  const socket = io("http://localhost:8000");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("message", (msg) => {
      console.log(msg);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(
      `${serverUrl}/message/send/${userId}`,
      { content: message },
      { withCredentials: true }
    );
    console.log("mesga ", data);
    if (data?.success) {
      setMessages((prevMessages) => [...prevMessages, message]);
      alert.success(data?.message);
      setMessage("");
    } else {
      alert.error(data?.message);
    }
    // socket.emit("chat message", message);
  };

  return (
    <Fragment>
      <div className="main-message-container">
        <div className="friends-container">
          <h3 style={{ marginBottom: "10px" }}>All Friends</h3>
          <hr style={{ marginBottom: "10px" }} />
          <CloseFriend message={true} />
        </div>
        <div className="message-container">
          <div className="receiver-header-container">
            <div className="receiver-header-info">
              <div className="receiver-header">
                <div className="receiver-avatar">
                  <img src={user?.avatar} alt="img" />
                </div>
                <div className="receiver-name">{user?.username}</div>
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
                  messages.map((message) => (
                    <div key={message?._id} className="text-msg">
                      <li
                        className={`${
                          userId === message?.sender ? "right" : "left"
                        }`}
                      >
                        {message?.content}
                      </li>
                      <DoneAllIcon style={{ color: `${message.read} ? "blue" : "white"`}} />
                      <DeleteIcon style={{ color: "red", height: 50, float: "right" }}/>
                    </div>
                  ))}
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
          <h3 style={{ marginBottom: "10px" }}>online users</h3>
          <hr style={{ marginBottom: "10px" }} />
          <Online message={true} />
        </div>
      </div>
    </Fragment>
  );
};

export default MessageHeader;
