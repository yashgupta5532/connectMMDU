import React, { useEffect, useState } from "react";
import "./feed.css";
import Share from "../share/Share.jsx";
import Post from "../post/Post.jsx";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import {toast} from "react-toastify"

export default function Feed({ user }) {
  const [allPosts, setAllPosts] = useState([]);
  useEffect(() => {
    try {
      const fetchAllPosts = async () => {
        const { data } = await axios.get(`${serverUrl}/post/all-posts`, {
          withCredentials: true,
        });
        if (data?.success) {
          // console.log("all posts is",data);
          setAllPosts(data?.data);
        } else {
          console.log(data?.message);
        }
      };
      fetchAllPosts();
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
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share user={user} myId={user?._id} />
        {allPosts &&
          allPosts.map((post) => (
            <Post
              key={post?._id}
              post={post}
              userId={user?._id}
              ownerId={post?.owner}
            />
          ))}
      </div>
    </div>
  );
}
