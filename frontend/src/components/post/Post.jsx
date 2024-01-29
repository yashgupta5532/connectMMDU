import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";
import CommentDialog from "../commentDialog/CommentDialog.js";
import UpdatePostDialog from "../Postd/UpdatePostDialog.js";
import { format } from "timeago.js";

function Post({ post, userId, ownerId }) {
  const [like, setLike] = useState(post?.likes.length);
  const [isliked, setIsLiked] = useState(post?.likes.includes(userId));
  const [comments, setComments] = useState(post?.comments.length);
  // const [isCommented, setIsCommented] = useState(
  //   post?.comments.includes({ user: userId })
  // );
  const [postOwner, setPostOwner] = useState("");
  const [isEditPostDialogOpen, setIsEditPostDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPostOwnerDetails = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/user/userDetails/${ownerId}`,
          { withCredentials: true }
        );
        if (data?.success) {
          setPostOwner(data?.data);
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
    fetchPostOwnerDetails();
  });

  const likeHandler = async (postId) => {
    try {
      const { data } = await axios.post(
        `${serverUrl}/post/like-dislike/${postId}`,
        null,
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success(data?.message);
        setIsLiked(!isliked);
        setLike(isliked ? like - 1 : like + 1);
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

  const handleOpenEditDialog = () => {
    setIsEditPostDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditPostDialogOpen(false);
  };

  const handleOpenCommentDialog = () => {
    setIsCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setIsCommentDialogOpen(false);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <Link to={`profile/${ownerId}`}>
            <div className="postTopLeft">
              <img className="postProfileImg" src={postOwner?.avatar} alt="" />
              {postOwner && postOwner?.online && (
                <span className="rightbarOnline3"></span>
              )}
              <span className="postUsername">{postOwner?.username}</span>
              <div>
                <span
                  className="postDate"
                  style={{ color: "blue", marginRight: "1vmax" }}
                >
                  {" "}
                  {format(postOwner?.lastActivity)}
                </span>
                <span className="postDate">
                  {format(post?.createdAt, "en_US")}
                </span>
              </div>
            </div>
          </Link>
          <div className="postTopRight">
            {userId === postOwner?._id && (
              <MoreVert onClick={handleOpenEditDialog} />
            )}
          </div>
        </div>
        <div className="postCenter">
          <b>
            {" "}
            <span className="postText">{post?.title}</span>
            <br />
          </b>
          <span className="postText">{post?.description}</span>
          {/* <img className="postImg" src={post?.images[0]} alt="" /> */}
          <div className="postImageContainer">
            {post?.images.map((image, index) => (
              <div key={index} className="postImageItem">
                {image.endsWith(".pdf") ? (
                  <a href={image} target="_blank" rel="noopener noreferrer">
                    <div>
                      <iframe
                        title={`pdf-${index}`}
                        src={image}
                        width="100%"
                        height="500px"
                      ></iframe>
                    </div>
                  </a>
                ) : (
                  <img className="postImg" src={image} alt={`post-${index}`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="postBottom">
          <div
            className="postBottomLeft"
            onClick={() => likeHandler(post?._id)}
          >
            <img
              className="likeIcon"
              src={isliked ? "/assets/heart.png" : "/assets/like.png"}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight" onClick={handleOpenCommentDialog}>
            <span className="postCommenttext">{comments} comments</span>
          </div>
          <CommentDialog
            open={isCommentDialogOpen}
            onClose={handleCloseCommentDialog}
            postId={post?._id}
            comments={post?.comments}
          />
          <UpdatePostDialog
            open={isEditPostDialogOpen}
            onClose={handleCloseEditDialog}
            postId={post?._id}
            image={post?.images[0]}
            title={post?.title}
            description={post?.description}
          />
        </div>
      </div>
    </div>
  );
}

export default Post;