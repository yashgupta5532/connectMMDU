import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";
import "./closeFriend.css";
import { Link } from "react-router-dom";

export default function CloseFriend({ message = false }) {
  const [allFriends, setAllFriends] = useState([]);
  const alert = useAlert();
  useEffect(() => {
    const fetchAllFriends = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/user/all/friends`, {
          withCredentials: true,
        });
        // console.log("data res",data);
        if (data?.success) {
          setAllFriends(data?.data);
        } else {
          alert.error(data?.message);
        }
      } catch (error) {
        alert.error(error);
      }
    };
    fetchAllFriends();
  }, [alert]);

  return (
    <Fragment>
      {allFriends &&
        allFriends.map((friend) => (
          <Link to={`${message ? `/message/${friend?._id}` : `/profile/${friend?._id}`}`} key={friend?._id}>
            <li className="sidebarFriend" key={friend?._id}>
              <img className="sidebarFriendImg" src={friend?.avatar} alt="" />
              <span className="sidearFriendName">{friend?.username}</span>
            </li>
          </Link>
        ))}
    </Fragment>
  );
}
