import React, { Fragment, useState, useEffect } from "react";
import "./FriendRequest.css";
import axios from "axios";
import { serverUrl } from "../../../constants";
import { useAlert } from "react-alert";
import Suggestion from "../Suggestion/Suggestion";
import Loader from "../../Loader/Loader";
import { Link } from "react-router-dom";

const FriendRequest = () => {
  const [allFriendRequestUser, setAllFriendRequestUser] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const alert = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllFriendRequests = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/user/all/friends/requests`,
          { withCredentials: true }
        );

        if (data.success) {
          setAllFriendRequestUser(data?.data);
        }
      } catch (error) {
        alert.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFriendRequests();
  }, [alert]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetailsPromises = allFriendRequestUser.map(async (request) => {
        const userDetailsResponse = await axios.get(
          `${serverUrl}/user/userDetails/${request.sender}`,
          { withCredentials: true }
        );
        return userDetailsResponse.data.data;
      });

      const userDetails = await Promise.all(userDetailsPromises);
      setUserDetails(userDetails);
    };

    if (allFriendRequestUser.length > 0) {
      fetchUserDetails();
    }
  }, [allFriendRequestUser]);

  const handleAcceptRejectFriendRequest = async (status, friendId) => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/user/response/friendRequest`,
        { status, friendId },
        { withCredentials: true }
      );
      console.log("response of friendrequest", data);
      if (data.success) {
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
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <h3 className="h-center">Friend Requests</h3>
          <div className="f-wrap">
            {userDetails &&
              userDetails.map((user) => (
                  <Link to={`/profile/${user?._id}`} key={user?._id}  >
                <div className="friend-request-container">
                  <div className="friend-user-container">
                    <div className="images">
                      <img src={user?.avatar} alt="img" />
                    </div>
                    <div className="name">
                      <h3>{user?.fullname}</h3>
                    </div>
                    <div className="friends-count">
                      <img src={user?.avatar} alt="" />
                      <p>{user?.FriendsCount} mutual Friends</p>
                    </div>
                    <button
                      className="btn-confirm"
                      onClick={() =>
                        handleAcceptRejectFriendRequest("Accepted", user?._id)
                      }
                    >
                      Confirm
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() =>
                        handleAcceptRejectFriendRequest("Rejected", user?._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
                  </Link>
              ))}
          </div>
          <Suggestion />
        </Fragment>
      )}
    </Fragment>
  );
};

export default FriendRequest;
