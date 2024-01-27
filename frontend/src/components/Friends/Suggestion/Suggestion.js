import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../../constants.js";
// import { Link } from "react-router-dom";

const Suggestion = () => {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState({});

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/user/find/matchers`, {
          withCredentials: true,
        });
        console.log("response in suggestion", data?.data);
        if (data?.success) {
          setSuggestedFriends(data?.data);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    };

    fetchSuggestedFriends();
  }, [toast]);

  useEffect(() => {
    const storedRequests =
      JSON.parse(localStorage.getItem("sentFriendRequests")) || {};
    setSentFriendRequests(storedRequests);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sentFriendRequests",
      JSON.stringify(sentFriendRequests)
    );
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
        toast.success(data.message);
      } else {
        toast.error("Error", data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <Fragment>
      <h1 className="h-center">People you may Know !</h1>
      <div className="f-wrap">
        {suggestedFriends?.map((friend) => (
          // <Link to={`/profile/${friend?._id}`} key={friend?._id} >
          <div className="friend-request-container">
            <div className="friend-user-container">
              <div className="images">
                <img src={friend?.avatar} alt="img" />
              </div>
              <div className="name">
                <h3>{friend?.username}</h3>
              </div>
              <div className="friends-count">
                <img src={friend?.avatar} alt="" />
                <p>{friend?.friends.length} mutual Friends</p>
              </div>
              <button
                className="btn-delete"
                onClick={() => handleFriendRequest(friend?._id)}
              >
                {sentFriendRequests[friend?._id]
                  ? "Cancel Request"
                  : "Add Friend"}
              </button>
              {/* <button
                className={`btn-confirm ${
                  sentFriendRequests[friend?._id] ? "hidden" : ""
                }`}
              >
                Remove
              </button> */}
            </div>
          </div>
          // </Link>
        ))}
      </div>
    </Fragment>
  );
};

export default Suggestion;
