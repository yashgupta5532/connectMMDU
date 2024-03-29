import React, { Fragment, useEffect, useState } from "react";
import "./online.css";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

export default function Online({ message = false }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const alert = useAlert();
  useEffect(() => {
    const fetchOnlinUsers = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/user/all/online/friends`,
          {
            withCredentials: true,
          }
        );
        console.log("data res", data);
        if (data?.success) {
          setOnlineUsers(data?.data);
        } else {
          alert.error(data?.message.toString());
        }
      } catch (error) {
        // alert.error(error.toString());
      }
    };
    fetchOnlinUsers();
  }, []);

  return (
    <Fragment>
      <div className="online-users">
        {onlineUsers &&
          onlineUsers.map((user) => (
            <Link
              to={`${
                message ? `/message/${user?._id}` : `/profile/${user?._id}`
              }`}
              key={user?._id}
            >
              <li className="rightbarFriend">
                <div className="rightbarProfileImgContainer">
                  <img
                    className="rightbarProfileImg"
                    src={user?.avatar}
                    alt=""
                  />
                  <span className="rightbarOnline"></span>
                </div>
                <span className="rightbarUsername">{user?.username}</span>
              </li>
            </Link>
          ))}
      </div>
    </Fragment>
  );
}
