import React, { Fragment, useEffect, useState } from "react";
import "./rightbar.css";
import Online from "../online/Online.jsx";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Rightbar({ user }) {
  //   console.log("user is ", user);

  const HomeRightbar = ({ user }) => {
    return (
      <>
        {/* <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <div className="rightbarFollowing">
              <img src={user?.avatar} alt="" className="rightbarFollowingImg" />
              <span className="rightbarFollowingname">{user?.username}</span>
            </div>
          </span>
        </div> */}
        {/* <img className="rignhtbarAd" src="assets/ad.png" alt="" /> */}
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarfriendList">
          <Online />
        </ul>
      </>
    );
  };

  const ProfileRightbar = ({ user }) => {
    const [allFriends, setAllFriends] = useState([]);

    useEffect(() => {
      const fetchAllFriends = async () => {
        try {
          const { data } = await axios.get(`${serverUrl}/user/all/friends`, {
            withCredentials: true,
          });
          // console.log("data res", data);
          if (data?.success) {
            setAllFriends(data?.data);
          } else {
            toast.error(data?.message);
          }
        } catch (error) {
          console.log(error)
          // if (
          //   error.response &&
          //   error.response.data &&
          //   error.response.data.message
          // ) {
          //   toast.error(error.response.data.message);
          // } else {
          //   toast.error("An unexpected error occurred.");
          // }
        }
      };
      fetchAllFriends();
    }, [toast]);
    return (
      <>
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Username:</span>
            <span className="rightbarInfoValue">{user?.username}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Status:</span>
            <span className="rightbarInfoValue">{user?.status}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Gender</span>
            <span className="rightbarInfoValue">{user?.gender}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user?.martialStatus}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">No. of Followers:</span>
            <span className="rightbarInfoValue">{user?.followers.length}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">No. of Friends:</span>
            <span className="rightbarInfoValue">{user?.friends.length}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Department:</span>
            <span className="rightbarInfoValue">{user?.department}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Branch:</span>
            <span className="rightbarInfoValue">{user?.branch}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">yearOfStudy:</span>
            <span className="rightbarInfoValue">{user?.yearOfStudy}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Interests:</span>
            <span className="rightbarInfoValue">
              {user?.interests.map((interest, index) => (
                <span key={index}> {interest} </span>
              ))}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Hobbies:</span>
            <span className="rightbarInfoValue">
              {user?.hobbies.map((hobby, index) => (
                <span key={index}> {hobby} </span>
              ))}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {allFriends &&
            allFriends.map((friend) => (
              <Link to={`/profile/${friend?._id}`} key={friend?._id}>
                <div className="rightbarFollowing">
                  <img
                    src={friend?.avatar}
                    alt={friend?.username}
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingname">
                    {friend?.username}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {/* {user ? <ProfileRightbar user={user}/> : <HomeRightbar user={user}/> } */}
        <ProfileRightbar user={user} />
        <HomeRightbar user={user} />
      </div>
    </div>
  );
}


export default Rightbar;