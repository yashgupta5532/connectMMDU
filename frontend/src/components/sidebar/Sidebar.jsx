import React, { useState } from "react";
import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../constants";
import { useAlert } from "react-alert";

export default function Sidebar() {
  const [isFriendMenuOpen, setIsFriendMenuOpen] = useState(false);
  const alert = useAlert();
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
        alert.success(data.message);
      } else {
        alert.error(data.message);
      }
    } catch (error) {
      alert.error(error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">News-Feed</span>
          </li>
          <li className="sidebarListItem" onClick={toggleFriendMenu}>
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Friend</span>
          </li>
          {isFriendMenuOpen && (
            <ul className="nestedList">
              <Link to="/friend/request">
                <li className="nestedListItem sidebarListItem">
                  <RssFeed className="sidebarIcon" />
                  <span className="sidebarListItemText">Friend Request</span>
                </li>
              </Link>
              <Link to="/friend/all">
                <li className="nestedListItem sidebarListItem">
                  <RssFeed className="sidebarIcon" />
                  <span className="sidebarListItemText">Friends</span>
                </li>
              </Link>
              {/* Add more nested items as needed */}
            </ul>
          )}
          <Link to="/message">
            <li className="sidebarListItem">
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Chats</span>
            </li>
          </Link>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
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
        <button className="sidebarButton btn">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          <CloseFriend />
        </ul>
      </div>
    </div>
  );
}
