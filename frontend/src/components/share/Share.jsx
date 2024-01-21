import React, { useEffect, useState } from "react";
import "./share.css";
import { Link } from "react-router-dom";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material";
import axios from "axios";
import { serverUrl } from "../../constants";
import { useAlert } from "react-alert";

export default function Share({ user }) {
  const alert = useAlert();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState(null);

  const handleImageChange = (e) => {
    console.log("res is ",e.target.files)
    const image = e.target.files[0];
    console.log("image is ",image)
    setImages(image);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(
      `${serverUrl}/post/createPost`,
      { description, images },
      { withCredentials: true }
    );
    console.log("reso is ",data)
    if (data?.success) {
      alert.success(data?.message);
    } else {
      alert.error(data?.message);
    }
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
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
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
          {/* <div className="shareOptions">
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
          </div> */}
          <div className="shareOptions">
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
          </div>
          <div className="shareOptions">
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" onClick={handleCreatePost}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
