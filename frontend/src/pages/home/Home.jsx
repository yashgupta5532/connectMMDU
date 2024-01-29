import React, { useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import Rightbar from "../../components/rightbar/Rightbar.jsx";
import "./Home.css";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/user/myDetails`, {
          withCredentials: true,
        });
        console.log("data is ", data);
        if (data?.success) {
          setUser(data?.data);
        } else {
          toast.error(data?.message);
          navigate("/login");
        }
      } catch (error) {
        toast.error(error?.response.data.message);
        navigate("/login");
      }
    };
    fetchMyInfo();
  }, []);

  const updateUserLastActivity = async (userId, online) => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/user/update/online/status`,
        { userId, online },
        { withCredentials: true }
      );
      // console.log("data is", data);
    } catch (error) {
      // console.error("Error updating last activity:", error);
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

  useEffect(() => {
    const updatePeriodically = setInterval(() => {
      updateUserLastActivity(user?._id, true);
    }, 5 * 60 * 1000);

    return () => clearInterval(updatePeriodically);
  }, [user]);

  useEffect(() => {
    const handleUnload = () => {
      updateUserLastActivity(user?._id, false);
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("load", () =>
      updateUserLastActivity(user?._id, true)
    );

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user]);

  return (
    <>
      <Topbar user={user} />
      <div className="homeContainer">
        <Sidebar user={user} />
        <Feed user={user} />
        <Rightbar user={user} />
      </div>
    </>
  );
};

export default Home;
