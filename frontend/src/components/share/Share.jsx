import React, { useState, Fragment } from "react";
import "./share.css";
import { Link } from "react-router-dom";
import { PermMedia, EmojiEmotions } from "@mui/icons-material";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";
import FeelingDialog from "./FeelingDialog.js";
import Loader from "../Loader/Loader.js";

function Share({ user, myId }) {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedImages = e.target.files;
    setImages(selectedImages);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUrl}/post/createPost`,
        formData,
        {
          withCredentials: true,
        }
      );
      // console.log("reso is ", data);
      if (data?.success) {
        toast.success(data?.message);
        setDescription("");
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
    } finally {
      setLoading(false);
    }
  };

  const followHandler = async () => {
    try {
      const { data } = await axios.post(
        `${serverUrl}/user/follow-unFollow/${user?._id}`,
        null,
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success(data?.message);
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
  };
  const [isFeelingDialogOpen, setFeelingDialogOpen] = useState(false);

  const closeFeelingDialog = () => [setFeelingDialogOpen(false)];
  const openFeelingDialog = () => {
    setFeelingDialogOpen(true);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="share">
          <div className="shareWrapper">
            <div>
              <Link to={`/profile/${user?._id}`}>
                <div
                  className="shareTop"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bolder",
                    color: "gray",
                    marginBottom: "10px",
                  }}
                >
                  <img className="shareProfileImg " src={user?.avatar} alt="" />
                  {user && user.online && (
                    <span className="rightbarOnline2"></span>
                  )}

                  <p className="shareInput ">{user?.fullname}</p>
                </div>
              </Link>
              <input
                placeholder={`What's in your mind, ${user?.fullname} ?`}
                className="shareInput"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{
                  fontStyle: "italic",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              />
            </div>
            <hr className="shareHr" />
            <form onSubmit={handleCreatePost}>
              <div className="shareBottom">
                <div className="shareOptions">
                  <div className="shareOption">
                    <img src={images[0]} alt="" />
                    <PermMedia htmlColor="tomato" className="shareIcon" />
                    <label className="file">
                      <input
                        type="file"
                        required
                        name="images"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="shareOptions">
                  <div className="shareOption">
                    <CropOriginalIcon htmlColor="green" className="shareIcon" />
                    <span className="shareOptionText">
                      Posts {user?.posts.length}
                    </span>
                  </div>
                </div>
                <div className="shareOptions">
                  <div className="shareOption" onClick={openFeelingDialog}>
                    <EmojiEmotions
                      htmlColor="goldenrod"
                      className="shareIcon"
                    />
                    <span className="shareOptionText">Feelings</span>
                  </div>
                </div>
                <button className="shareButton" type="submit">
                  Share
                </button>
                <button
                  className="shareButton"
                  disabled={user?._id === myId ? true : false}
                  onClick={followHandler}
                  type="button"
                  style={{ backgroundColor: "#1877f2"}}
                >
                  {user?.followers.includes(myId) ? "Following " : "Follow "}
                  {user?.followers.length}
                </button>
              </div>
            </form>
            <FeelingDialog
              open={isFeelingDialogOpen}
              onClose={closeFeelingDialog}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Share;
