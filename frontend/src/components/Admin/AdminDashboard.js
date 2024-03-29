import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const alert = useAlert();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data } = await axios.get(`${serverUrl}/post/admin`, {
          withCredentials: true,
        });
        if (data?.success) {
          setPosts(data?.data);
          alert.success(data?.message);
        } else {
          alert.error(data?.message);
        }
      };
      fetchData();
    } catch (error) {
      alert.error(error);
    }
  }, [alert]);

  const updatepostStatus = async (postId, newStatus) => {
    try {
      if (newStatus === "Approved") {
        const { data } = await axios.put(
          `${serverUrl}/post/approve/${postId}`,
          {},
          {
            withCredentials: true,
          }
        );
        if (data?.success) {
          alert.success(data?.message);
        } else {
          alert.error(data?.message);
        }
      } else if (newStatus === "Rejected") {
        const { data } = await axios.put(
          `${serverUrl}/post/approve/${postId}`,
          {},
          {
            withCredentials: true,
          }
        );
        if (data?.success) {
          alert.success(data?.message);
        } else {
          alert.error(data?.message);
        }
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, status: newStatus } : post
        )
      );
    } catch (error) {
      alert.error("Error updating post status:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const { data } = await axios.delete(
        `${serverUrl}/post/delete-admin/${postId}`,
        { withCredentials: true }
      );
      if(data?.success){
        alert.success(data?.message)
      }else{
        alert.error(data?.message)
      }
      setPosts((prevPosts) =>
        prevPosts.filter((post) => {
          return post._id !== postId;
        })
      );
    } catch (error) {
      alert.error("error while deleting the post", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 style={{ textAlign: "center" }}>
        All posts (Pending/Rejected/Approved)
      </h1>
      <Link to="/admin/all-contact" className="contact-info">
        Contact us info{" "}
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <div className="post-info">
              <h4>{post.title}</h4>
              <p>
                Uploaded by:{" "}
                <b>
                  {post?.owner.username} ({post?.owner.email})
                </b>
              </p>
              <p>
                Title: <b> {post?.title}</b>
              </p>
              <p>
                Status: <b> {post?.status}</b>
              </p>
              <p>Created At: {new Date(post?.createdAt).toLocaleString()}</p>
              <div className="item">
                <a
                  href={post?.images[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
                {post.images && <img src={post.images[0]} alt="Thumbnail" />}
              </div>
            </div>
            <div className="post-actions">
              {post.status === "Pending" && (
                <>
                  <button
                    className="approve-button"
                    onClick={() => updatepostStatus(post?._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => updatepostStatus(post?._id, "Rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(post?._id)}
                  >
                    Delete
                  </button>
                </>
              )}
              {post.status === "Approved" && (
                <>
                  <button
                    className="reject-button"
                    onClick={() => updatepostStatus(post?._id, "Rejected")}
                  >
                    Re-Reject
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(post?._id)}
                  >
                    Delete
                  </button>
                </>
              )}
              {post.status === "Rejected" && (
                <>
                  <button
                    className="approve-button"
                    onClick={() => updatepostStatus(post?._id, "Approved")}
                  >
                    Re-Approve
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(post?._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
