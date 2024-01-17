import React, { useContext, useRef } from "react";
import "./UpdateUser.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { publicRequest } from "../../requestMethods";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import profile from "../../images/profile.png";
import { updateProfilePicture } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

const UpdateUser = () => {
  const dispatch =useDispatch()
  const { currentUser: user } = useSelector((state) => state.user);
  // const { profilePicture } = useSelector((state) => state.user);

  const [firstname, setfirstname] = useState();
  const [lastname, setlastname] = useState();
  const [username, setUsername] = useState();
  const [institution, setinstitution] = useState();
  const [interested, setinterested] = useState();
  const [photo, setphoto] = useState(null);
  const [password, setpassword] = useState();

  const navigate = useNavigate();

  const UpdateFormHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      userId: user._id,
      firstname: firstname,
      lastname: lastname,
      username: username,
      interested: interested,
      institution: institution,
      password: password,
    };
    let newProfilePictureURL = user.profilePicture;
    if (photo) {
      const data = new FormData();
      const cloudName = "dbd0psf0f";
      data.append("file", photo);
      const upload_preset = "handnoteimages";
      data.append("upload_preset", "handnoteimages");
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload?upload_preset=${upload_preset}`,
        data
      );
      newUser.profilePicture = await res.data.secure_url;
      newProfilePictureURL = await res.data.secure_url;
    }
    try {
      await publicRequest.put(`users/${user._id}`, newUser);
      dispatch(updateProfilePicture(newProfilePictureURL));
      alert("successfully uploaded...");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Update-container">
        <div className="Update-profile-container">
          <div className="Update-profile-container-left">
            <div className="Update-profile-container-left-top">
              <img
                src={user.profilePicture ? user.profilePicture : profile}
                className="Update-profile-container-left-top-img"
              ></img>

              <div className="Update-profile-container-left-top-user-desc">
                <p className="Update-profile-container-left-top-name">
                  <span>{user.firstname}</span> <span>{user.lastname} </span>
                </p>
                <p className="Update-profile-container-left-top-username">
                  {user.username}
                </p>
              </div>
            </div>
          </div>

          <div className="Update-profile-container-right">
            <p className="Update-profile-container-right-heading">
              Your Personal Profile Info
            </p>
            <form
              onSubmit={UpdateFormHandler}
              className="Update-profile-container-right-form"
            >
              <div className="input-box">
                <p className="input-heading">first name</p>
                <input
                  type="text"
                  placeholder="firstname"
                  onChange={(e) => setfirstname(e.target.value)}
                  className="input-block"
                ></input>
              </div>

              <div className="input-box">
                <p className="input-heading">last name</p>
                <input
                  type="text"
                  placeholder="lastname"
                  onChange={(e) => setlastname(e.target.value)}
                  className="input-block"
                ></input>
              </div>

              <div className="input-box">
                <p className="input-headig">username</p>
                <input
                  className="input-block"
                  type="text"
                  placeholder="username"
                  onChange={(e) => setUsername(e.target.value)}
                ></input>
              </div>

              <div className="input-box">
                <p className="input-heading">Institution</p>
                <input
                  type="text"
                  placeholder="institution"
                  onChange={(e) => setinstitution(e.target.value)}
                  className="input-block"
                ></input>
              </div>

              <div className="input-box">
                <p className="input-heading">Interested field</p>
                <input
                  type="text"
                  placeholder="eg. physics,coding,biology..."
                  onChange={(e) => setinterested(e.target.value)}
                  className="input-block"
                ></input>
              </div>

              <div className="input-box">
                <p className="input-heading">Update your password</p>
                <input
                  type="password"
                  placeholder="not required"
                  onChange={(e) => setpassword(e.target.value)}
                  minLength="6"
                  className="input-block"
                ></input>
              </div>

              <div className="input-box">
                <p className="input-heading">Profile picture</p>
                <input
                  type="file"
                  className="input-block"
                  id="input-bloack-file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setphoto(e.target.files[0])}
                  style={{ border: "none", borderRadius: "0%" }}
                ></input>
              </div>

              <button
                type="submit"
                className="Update-profile-container-right-form-submit"
              >
                Update-profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
