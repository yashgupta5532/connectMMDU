import React, { useEffect, useState } from "react";
import "./profile.css";
import Topbar from "../../components/topbar/Topbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
// import Feed from "../../components/feed/Feed.jsx";
import Rightbar from "../../components/rightbar/Rightbar.jsx";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Share from "../../components/share/Share.jsx";
import Post from "../../components/post/Post.jsx";

const Profile=() =>{
  const { userId } = useParams();
  // console.log("user id ",userId)
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading,setLoading] =useState(false)


  const [myDetails, setMyDetails] = useState(null);

  useEffect(() => {
    const fetchMyDetials = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${serverUrl}/user/myDetails`, {
          withCredentials: true,
        });
        if (data?.success) {
          setMyDetails(data?.data);
        } else {
          toast.error(data?.message);
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
      finally{
        setLoading(false)
      }
    };
    fetchMyDetials();
  }, []);

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
          toast.error(data?.message);;
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    };
    fetchMyInfo();
  }, [userId]);

  useEffect(() => {
    const fetchMyPosts = async () => {
     try {
       const { data } = await axios.get(`${serverUrl}/post/myPosts/${userId}`, {
         withCredentials: true,
       });
       if (data?.success) {
         setMyPosts(data?.data);
       }else{
        toast.error(data?.message)
       }
     } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
     }
    };
    fetchMyPosts();
  }, [userId]);

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
              src={user?.coverImage[0] || "/assets/bg.png"}
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
                      userId={myDetails?._id}
                      ownerId={post?.owner}
                      profiling={true}
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


export default Profile;