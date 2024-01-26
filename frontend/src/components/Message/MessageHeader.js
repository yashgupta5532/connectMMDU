import React, { Fragment, useEffect, useState, useRef } from "react";
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
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
import { format } from "timeago.js";
import { socketUrl } from "../../constants.js";
const ROOT_CSS = css({
  height: 600,
});

const MessageHeader = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const alert = useAlert();
  const [visibleMessages, setVisibleMessages] = useState([]);

  const messagesRef = useRef([]);
  messagesRef.current = messagesRef.current.slice(0, messages.length);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId;
            if (!visibleMessages.includes(messageId)) {
              markAsReadMessage(messageId);
              setVisibleMessages((prevVisibleMessages) => [
                ...prevVisibleMessages,
                messageId,
              ]);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    messagesRef.current.forEach((messageRef) => {
      observer.observe(messageRef);
    });

    return () => {
      observer.disconnect();
    };
  }, [messages,visibleMessages]);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/user/userDetails/${userId}`,
          {
            withCredentials: true,
          }
        );
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
      if (data?.success) {
        setMessages(data?.data);
      } else {
        alert.error(data?.message);
      }
    };
    fetchAllMessages();
  }, [userId, message, alert]);

  const socket = io(socketUrl);

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

  const markAsReadMessage = async (messageId) => {
    await axios.put(
      `${serverUrl}/message/read/${messageId}`,
      {},
      { withCredentials: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(
      `${serverUrl}/message/send/${userId}`,
      { content: message },
      { withCredentials: true }
    );
    if (data?.success) {
      setMessages((prevMessages) => [...prevMessages, data.data]);
      alert.success(data?.message);
      setMessage("");
    } else {
      alert.error(data?.message);
    }
  };

  const handleDeleteMsg = async (messageId) => {
    try {
      const { data } = await axios.delete(
        `${serverUrl}/message/delete/${messageId}`,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        alert.success(data.message);
      } else {
        alert.error(data?.message);
      }
    } catch (error) {
      alert.error(error);
    }
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

          <div className="message-body-container">
            <ScrollToBottom className={ROOT_CSS}>
              <div className="message">
                <ul>
                  {messages &&
                    messages.map((message) => (
                      <Fragment key={message._id}>
                        <li
                          ref={(el) => el && messagesRef.current.push(el)}
                          data-message-id={message._id}
                          className={`text-msg ${
                            userId === message.sender ? "rightSide" : "leftSide"
                          }`}
                        >
                          <p>{message?.content}</p>
                          {(message?.sender === userId ||
                            message.receiver === userId) && (
                            <DeleteIcon
                              className="message-svg"
                              style={{
                                color: "red",
                                float: "right",
                              }}
                              onClick={() => handleDeleteMsg(message?._id)}
                            />
                          )}
                          <DoneAllIcon
                            className="message-svg"
                            style={{
                              color: message.read ? "blue" : "white",
                            }}
                          />
                        </li>
                        <p
                          className={`text-msg ${
                            userId === message.sender
                              ? "rightSide2"
                              : "leftSide2"
                          }`}
                          style={{ marginTop: "-0.75vmax" }}
                        >
                          {format(message?.createdAt)}
                        </p>
                      </Fragment>
                    ))}
                </ul>
              </div>
            </ScrollToBottom>
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
