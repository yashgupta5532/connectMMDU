import { Button, Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import "./UpdatePost.css";
import Loader from "../Loader/Loader.js";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";

const UpdatePost = ({ postId, image, titled, desc }) => {
  const [images, setImage] = useState(image);
  const [title, setTitle] = useState(titled);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(desc);
  const alert = useAlert();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {};
    if (title !== titled) {
      updatedData.title = title;
    }
    if (description !== desc) {
      updatedData.description = description;
    }

    if (images !== image) {
      const { data } = await axios.put(
        `${serverUrl}/post/update-post/image/${postId}`,
        {},
        { withCredentials: true }
      )
      console.log("image is", data);
      if (data?.success) {
        alert.success(data?.message);
      } else {
        alert.error(data?.message);
      }
    }

    if (Object.keys(updatedData).length > 0) {
      const { data } = await axios.put(
        `${serverUrl}/post/update-post/${postId}`,
        updatedData,
        { withCredentials: true }
      );
      if (data?.success) {
        alert.success(data?.message);
      } else {
        alert.error(data?.message);
      }
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="update-post">
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Update post
          </Typography>
          <div className="updatePost-form-container">
            <form className="updatePost-form" onSubmit={handleSubmit}>
              <div className="form " style={{ textAlign: "center" }}>
                {images && <img src={images} alt="post" />}
                <input
                  type="file"
                  // accept="*"
                  // accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="form">
                {" "}
                <input
                  type="text"
                  name="title"
                  placeholder="title here"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form">
                {" "}
                <textarea
                  name="description"
                  placeholder="Description here"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  cols={50}
                />
              </div>
              <Button type="submit">Update</Button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UpdatePost;
