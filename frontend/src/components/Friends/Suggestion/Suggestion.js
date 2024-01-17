import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import axios from "axios";
import {serverUrl} from "../../../constants.js"

const Suggestion = () => {
  const alert = useAlert();
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState({});

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        console.log("clicked", serverUrl);
        const { data } = await axios.get(
          `${serverUrl}/user/find/matchers`,
          { withCredentials: true }
        );
        console.log("response in suggestion", data.data);
        if (data.success) {
          setSuggestedFriends(data.data);
        }
      } catch (error) {
        alert.error(error.response.data.message);
      }
    };
  
    fetchSuggestedFriends();
  }, [alert]);

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("sentFriendRequests")) || {};
    setSentFriendRequests(storedRequests);
  }, []);

  useEffect(() => {
    localStorage.setItem("sentFriendRequests", JSON.stringify(sentFriendRequests));
  }, [sentFriendRequests]);
  

  const handleFriendRequest = async (userId) => {
    console.log("clicked", process.env.REACT_APP_BACKEND_URL);
    try {
      let url = `${serverUrl}/user/sendFriendRequest/${userId}`;
      if (sentFriendRequests[userId]) {
        url = `${serverUrl}/user/cancelFriendRequest/${userId}`;
      }
      const { data } = await axios.post(url, null, { withCredentials: true });
      console.log("response of friendrequest", data);
      if (data.success) {
        setSentFriendRequests((prevRequests) => ({
          ...prevRequests,
          [userId]: !prevRequests[userId],
        }));
        alert.success(data.message);
      } else {
        alert.error("Error", data.message);
      }
    } catch (error) {
      alert.error(error);
    }
  };

  return (
    <Fragment>
      <h1 className="h-center">People you may Know !</h1>
      <div className="f-wrap">
        {suggestedFriends?.map((friend) => (
          <div key={friend._id} className="friend-request-container">
            <div className="friend-user-container">
              <div className="images">
                <img src={friend.avatar} alt="img" />
              </div>
              <div className="name">
                <h3>{friend.username}</h3>
              </div>
              <div className="friends-count">
                <img src={friend.avatar} alt="" />
                <p>{friend.friends.length} mutual Friends</p>
              </div>
              <button
                className="btn-delete"
                onClick={() => handleFriendRequest(friend._id)}
              >
                {sentFriendRequests[friend._id]
                  ? "Cancel Request"
                  : "Add Friend"}
              </button>
              <button
                className={`btn-confirm ${
                  sentFriendRequests[friend._id] ? "hidden" : ""
                }`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default Suggestion;
