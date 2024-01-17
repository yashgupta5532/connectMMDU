import React, { useEffect, useState } from "react";
import "./profile.css";
import Topbar from "../../components/topbar/Topbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import Rightbar from "../../components/rightbar/Rightbar.jsx";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";

export default function Profile() {
  const [user, setUser] = useState(null);
  const alert = useAlert();
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/user/myDetails`, {
          withCredentials: true,
        });
        if (data.success) {
          setUser(data.data);
        } else {
          alert.error(data.message);
        }
      } catch (error) {
        alert.error(error);
      }
    };
    fetchMyInfo();
  }, [alert]);

  return (
    <>
      <Topbar avatar={user?.avatar}/>
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profilerightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user?.coverImage}
                alt="Cover"
              />
              <img className="profileUserImg" src={user?.avatar} alt="" />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user?.username}  ({user?.fullname})</h4>
              <span className="profileInfoDesc">{user?.status}</span>
              {/* <div className="d-flex">
                <p className="profileInfoName">Department :{user?.department}</p>
                <p className="profileInfoName">Branch :{user?.branch}</p>
                <p className="profileInfoName">Year of Study :{user?.yearOfStudy}</p>
              </div> */}
            </div>
          </div>
          <div className="profilerightBottom">
            <Feed />
            <Rightbar profile />
          </div>
        </div>
      </div>
    </>
  );
}
