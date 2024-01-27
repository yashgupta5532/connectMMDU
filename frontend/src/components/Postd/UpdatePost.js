import { Button, Typography } from "@mui/material";
import React, { Fragment, useState } from "react";
import "./UpdatePost.css";
import Loader from "../Loader/Loader.js";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";

const UpdatePost = ({ postId, image, titled, desc }) => {
  const [images, setImage] = useState(image);
  const [title, setTitle] = useState(titled);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(desc);

  // const handleImageChange = (e) => {
  //   const file = e.target.files;
  //   const Reader = new FileReader();
  //   Reader.readAsDataURL(file);
  //   Reader.onload = () => {
  //     if (Reader.readyState === 2) {
  //       setImage(Reader.result);
  //     }
  //   };
  // };

  const handleImageChange = (e) => {
    const selectedImages = e.target.files;
    setImage(selectedImages);
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

    // Handle image update
    if (images !== image) {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      try {
        const { data } = await axios.put(
          `${serverUrl}/post/update-post/image/${postId}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log("image is", data);
        if (data?.success) {
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.error("Error updating image:", error);
        toast.error("Error updating image. Please try again.");
      }
    }

    // Handle other updates
    if (Object.keys(updatedData).length > 0) {
      try {
        const { data } = await axios.put(
          `${serverUrl}/post/update-post/${postId}`,
          updatedData,
          { withCredentials: true }
        );
        if (data?.success) {
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.error("Error updating post:", error);
        toast.error("Error updating post. Please try again.");
      } finally {
        setLoading(false);
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
                <input type="file" name="images" onChange={handleImageChange} />
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
