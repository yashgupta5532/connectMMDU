import React, { useState, Fragment ,useEffect} from "react";
import "./sidebar.css";
import {
  RssFeed,
  Chat,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloseFriend from "../closeFriend/CloseFriend";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";

function Sidebar({ user }) {
  const [isFriendMenuOpen, setIsFriendMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleFriendMenu = () => {
    setIsFriendMenuOpen(!isFriendMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${serverUrl}/user/logout`, null, {
        withCredentials: true,
      });
      console.log("data is", data);
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
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

  return (
    <Fragment>
      <div className="sidebar" id="sidebar-container">
        <div className="sidebarWrapper ">
          <ul className="sidebarList">
            <li className="sidebarListItem ">
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">News-Feed</span>
            </li>
            <li className="sidebarListItem" onClick={toggleFriendMenu}>
              <Diversity1Icon className="sidebarIcon" />
              <span className="sidebarListItemText">Friend</span>
            </li>
            {isFriendMenuOpen && (
              <ul className="nestedList">
                <Link to="/friend/request">
                  <li className="nestedListItem sidebarListItem">
                    <PersonAddIcon className="sidebarIcon" />
                    <span className="sidebarListItemText">Friend Request</span>
                  </li>
                </Link>
                <Link to="/friend/all">
                  <li className="nestedListItem sidebarListItem">
                    <Group className="sidebarIcon" />
                    <span className="sidebarListItemText">Friends</span>
                  </li>
                </Link>
                {/* Add more nested items as needed */}
              </ul>
            )}
            <Link to={`/message/${user?._id}`}>
              <li className="sidebarListItem">
                <Chat className="sidebarIcon" />
                <span className="sidebarListItemText">Chats</span>
              </li>
            </Link>

            {user && user.role === "admin" && (
              <Link to="/admin/dashboard">
                <li className="sidebarListItem">
                  <AdminPanelSettingsIcon className="sidebarIcon" />
                  <span className="sidebarListItemText">Admin</span>
                </li>
              </Link>
            )}

            {/* <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li> */}
            <Link to="/update/profile">
              <li className="sidebarListItem">
                <Bookmark className="sidebarIcon" />
                <span className="sidebarListItemText">Update Profile</span>
              </li>
            </Link>
            <Link to="/contact">
              <li className="sidebarListItem">
                <HelpOutline className="sidebarIcon" />
                <span className="sidebarListItemText">Contact Us</span>
              </li>
            </Link>
            <li className="sidebarListItem">
              <WorkOutline className="sidebarIcon" />
              <span className="sidebarListItemText">Jobs</span>
            </li>
            <li className="sidebarListItem">
              <Event className="sidebarIcon" />
              <span className="sidebarListItemText">Events</span>
            </li>
            <li className="sidebarListItem" onClick={handleLogout}>
              <LogoutIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Logout</span>
            </li>
          </ul>
          <button className="sidebarButton btn sidebarListItemText">
            Show More
          </button>
          <hr className="sidebarHr" />
          <ul className="sidebarFriendList">
            <CloseFriend />
          </ul>
        </div>
      </div>
    </Fragment>
  );
}


export default Sidebar;