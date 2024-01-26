import React, { useState } from "react";
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../constants";
import Modal from "react-modal";
import MenuIcon from "@mui/icons-material/Menu";

export default function Topbar({ user }) {
  console.log("user is", user);
  const [keyword, setKeyword] = useState("");
  // const defaultAvatar =
  //   "https://imgs.search.brave.com/cIbwKjDMj9q3jhtd1OukCYhlZGdRRlYdxiBdjTbzKsw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/dzNzY2hvb2xzLmNv/bS93M2ltYWdlcy9h/dmF0YXIyLnBuZw";

  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideMenuText, setHideMenuText] = useState(false);

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/user/search/${keyword}`);
      console.log("data is ", data);
      if (data.success) {
        setSearchResults(data.data);
        setIsModalOpen(true);
      } else {
        setSearchResults([]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults([]);
      setIsModalOpen(false);
    }
  };

  const hideMenu = () => {
    const menuTextElements = document.querySelectorAll(".sidebarList span");
    menuTextElements.forEach((element) => {
      element.classList.toggle("hidden");
    });
    setHideMenuText(!hideMenuText);
  };

  const closeModal = () => {
    setSearchResults([]);
    setIsModalOpen(false);
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <MenuIcon style={{color:"white"}} className="sidebarIcon" onClick={hideMenu} />
        <span className="logo">Connect MMDU</span>
      </div>

      <div className="topbarCentre">
        <form onSubmit={handleSearch}>
          <div className="searchbar">
            <Search className="searchIcon" />
            <input
              placeholder="Search for friends, posts, or any video"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="searchInput"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
        </form>
      </div>

      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/login">
            <span className="topbarLink" style={{ color: "white" }}>
              SignIn
            </span>
          </Link>
          {/* <Link to="/timeline">
            <span className="topbarLink">Timeline</span>
          </Link> */}
        </div>
        <div className="topbarIcons">
          <Link to="/friend/request" style={{ color: "white" }}>
            <div className="topbarIconItem">
              <Person />
              <span
                className={`${
                  user?.friendRequests.length > 0 ? "topbarIconBadge" : "hidden"
                }`}
              >
                {user?.friendRequests?.length}
              </span>
            </div>
          </Link>
          <Link to={`/message/${user?._id}`} style={{ color: "white" }}>
            <div className="topbarIconItem">
              <Chat />
              <span
                className={`${
                  user?.messages.length > 0 ? "topbarIconBadge" : "hidden"
                }`}
              >
                {user?.messages.length}
              </span>
            </div>
          </Link>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <img src={user?.avatar} alt="avatar" className="topbarImg" />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Search Results"
      >
        <div className="searchResultsContainer">
          <ul className="searchResultsList">
            {searchResults.map((result) => (
              <li key={result._id}>
                <Link to={`/profile/${result._id}`}>
                  <img src={result.avatar} alt="" className="searchResultImg" />
                  <span className="searchResultName">{result.username}</span>
                  <span className="searchResultName">
                    {result.martialStatus}
                  </span>
                  <span className="searchResultName">{result.branch}</span>
                  <span className="searchResultName">{result.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
