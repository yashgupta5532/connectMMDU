import React, { useEffect, useState } from "react";
import "./share.css";
import { Link } from "react-router-dom";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material";
import axios from "axios";
import { serverUrl } from "../../constants";
import { useAlert } from "react-alert";
import FeelingDialog from "./FeelingDialog";

export default function Share({ user, myId }) {
  const alert = useAlert();
  // console.log(user?._id,myId,user?._id===myId);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

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
   
    const { data } =  await axios.post(`${serverUrl}/post/createPost`, formData, {
      withCredentials: true,
    });
    console.log("reso is ", data);
    if (data?.success) {
      alert.success(data?.message);
    } else {
      alert.error(data?.message);
    }
  };

  const followHandler = async () => {
    const { data } = await axios.post(
      `${serverUrl}/user/follow-unFollow/${user?._id}`,
      null,
      { withCredentials: true }
    );
    if (data?.success) {
      alert.success(data?.message);
    } else {
      alert.error(data?.message);
    }
  };
  const [isFeelingDialogOpen, setFeelingDialogOpen] = useState(false);

  const closeFeelingDialog = () => [setFeelingDialogOpen(false)];
  const openFeelingDialog = () => {
    setFeelingDialogOpen(true);
  };

  return (
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
              <img className="shareProfileImg" src={user?.avatar} alt="" />
              <p className="shareInput">{user?.fullname}</p>
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
                <Room htmlColor="green" className="shareIcon" />
                <span className="shareOptionText">Location</span>
              </div>
            </div>
            <div className="shareOptions">
              <div className="shareOption" onClick={openFeelingDialog}>
                <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
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
              style={{ backgroundColor: "#1877f2" }}
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
  );
}
