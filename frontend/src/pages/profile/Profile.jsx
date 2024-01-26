import React, { useEffect, useState } from "react";
import "./profile.css";
import Topbar from "../../components/topbar/Topbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import Rightbar from "../../components/rightbar/Rightbar.jsx";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import Share from "../../components/share/Share.jsx";
import Post from "../../components/post/Post.jsx";

export default function Profile() {
  const { userId } = useParams();
  // console.log("user id ",userId)
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const alert = useAlert();
  const defaultCoverImage =
    "https://imgs.search.brave.com/nday_SBE87w0EnZwLFKAvAvEKX6UQZA5RNjU4dX1Geg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0LzRl/Lzc2LzE0NGU3NjM2/N2EwNzA0NWI3ODQ1/ZmIwYTY2OWQ3OGNh/LmpwZw";

  const [myDetails, setMyDetails] = useState(null);

  useEffect(() => {
    const fetchMyDetials = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/user/myDetails`, {
          withCredentials: true,
        });
        if (data?.success) {
          setMyDetails(data?.data);
        } else {
          alert.error(data?.message);
        }
      } catch (error) {
        alert.error(error);
      }
    };
    fetchMyDetials();
  }, [alert]);

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
    const fetchMyPosts = async () => {
      const { data } = await axios.get(`${serverUrl}/post/myPosts/${userId}`, {
        withCredentials: true,
      });
      if (data?.success) {
        setMyPosts(data?.data);
      }
    };
    fetchMyPosts();
  }, []);

  return (
    <>
      <Topbar user={user} />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profilerightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user?.coverImage || defaultCoverImage}
                alt="Cover"
              />
              <img className="profileUserImg" src={user?.avatar} alt="" />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">
                {user?.username} ({user?.fullname})
              </h4>
              <span className="profileInfoDesc">{user?.status}</span>
            </div>
          </div>
          <div className="profilerightBottom">
            <div className="feed">
              <div className="feedWrapper">
                <Share user={user} myId={myDetails?._id} />
                {myPosts &&
                  myPosts.map((post) => (
                    <Post
                      key={post?._id}
                      post={post}
                      userId={user?._id}
                      ownerId={post?.owner}
                    />
                  ))}
                {/* <Feed user={user} /> */}
              </div>
            </div>
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
