import React from "react";
import "./UpdatePost.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { publicRequest } from "../../requestMethods";
import {useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from '../Navbar'
function UpdatePost() {
  const { notesid } = useParams();
  const { currentUser: user } = useSelector((state) => state.user);
  const [notename, setnotename] = useState();
  const [desc, setdesc] = useState();
  const [noteupdatedphoto, setnoteupdatedphoto] = useState(null);
  const [noteupdatedfile, setnoteupdatedfile] = useState("");

  const UpdateNoteHandler = async (e) => {
    e.preventDefault();
    alert("Updating started...");
  
    const newNote = {
      userId: user._id,
      notename: notename,
      desc: desc,
      notefilename: noteupdatedfile,
    };
  
    if (noteupdatedphoto) {
      try {
        const data = new FormData();
        const cloudName = "dbd0psf0f";
        data.append("file", noteupdatedphoto);
        const upload_preset = "handnoteimages";
        data.append("upload_preset", upload_preset);
        const cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload?upload_preset=${upload_preset}`;
        const res = await axios.post(cloudinaryUploadURL, data);
        newNote.thumbnailfilename = res.data.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        alert("Error uploading image.");
        return;
      }
    }
  
    try {
      const response = await publicRequest.put(`notes/${notesid}`, newNote);
  
      if (response.status === 200) {
        alert("Successfully updated.");
        // You can navigate or perform other actions here.
      } else {
        alert("Update failed. Please try again later.");
      }
    } catch (updateError) {
      console.error("Update error:", updateError);
      alert("Error updating note. Please try again later.");
    }
  };
  
  
  return (
    <>
    <Navbar />
      <div className="Update-post-container-complete">
        <div className="Update-post-container">
          <p className="Update-post-container-name">Update your note</p>
          <form
            onSubmit={UpdateNoteHandler}
            className="Update-post-container-form"
          >
            <div className="Update-post-input-box">
              <p className="Update-post-input-heading">Note name</p>
              <input
                type="text"
                placeholder="notename"
                onChange={(e) => setnotename(e.target.value)}
                className="Update-post-input-block"
              ></input>
            </div>

            <div className="Update-post-input-box">
              <p className="Update-post-input-heading">Descritpion</p>
              <input
                type="text"
                placeholder="Descritpion"
                onChange={(e) => setdesc(e.target.value)}
                className="Update-post-input-block"
              ></input>
            </div>

            <div className="Update-post-input-box">
              <p className="Update-post-input-heading">Note file Url</p>
              <input
                type="text"
                className="Update-post-input-block"
                placeholder="note file url(file must be in pdf format)"
                onChange={(e) => setnoteupdatedfile(e.target.value)}
              ></input>
            </div>

            <div className="Update-post-input-box-file">
              <p className="Update-post-input-heading-file">Thumbnail file</p>
              <input
                type="file"
                className="Update-post-input-block-file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setnoteupdatedphoto(e.target.files[0])}
              ></input>
            </div>
            <button type="submit" className="Update-post-container-form-submit">
              Update-Note
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdatePost;
