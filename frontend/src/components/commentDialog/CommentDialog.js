import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import CommentCard from "./CommentCard";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";

const CommentDialog = ({ open, onClose, postId, comments }) => {
  const [comment, setComment] = useState("");
  const [commentDetails, setCommentDetails] = useState([]);
  
  const alert=useAlert();

const fetchPostOwnerDetails = async (ownerId) => {
      const { data } = await axios.get(
        `${serverUrl}/user/userDetails/${ownerId}`,
        { withCredentials: true }
      );
      if (data?.success) {
        const userDetials = data?.data
        return userDetials
      }
    };

  useEffect(() => {
    const fetchCommentDetails = async () => {
      if (comments && comments.length > 0) {
        const commentDetailsArray = await Promise.all(
          comments.map(async (comment) => {
            const userDetails = await fetchPostOwnerDetails(comment?.user);
            return {
              userId: comment?.user?._id,
              name: userDetails?.username,
              avatar: userDetails?.avatar,
              comment: comment?.comment,
              commentId: comment?._id,
            };
          })
        );
        setCommentDetails(commentDetailsArray);
      }
    };
  
    fetchCommentDetails();
  }, []);
  

  // const handlePostComment = () => {
  //   onPostComment(comment);
  //   setComment("");
  //   onClose();
  // };

  const handlePostComment = async () => {
    const { data } = await axios.post(
      `${serverUrl}/post/comment/${postId}`,
      {comment},
      { withCredentials: true }
    );
    console.log("comment response ",data);
    if (data?.success) {
      alert.success(data?.message);
      setComment("");
      onClose();
    }else{
      alert.error(data?.message)
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { minWidth: '50vw', minHeight: '40vh' } }}>
      {commentDetails.map((commentDetail) => (
        <CommentCard key={commentDetail?.commentId} {...commentDetail} />
      ))}

      <DialogTitle>Write a Comment</DialogTitle>
      <DialogContent>
        <TextField
          label="Comment"
          multiline
          rows={10}
          variant="outlined"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handlePostComment}>
          Post Comment
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
