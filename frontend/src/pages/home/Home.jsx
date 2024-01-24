import React, { useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import Rightbar from "../../components/rightbar/Rightbar.jsx";
import "./Home.css";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { useAlert } from "react-alert";

export default function Home() {
  const [user, setUser] = useState(null);

  const alert = useAlert();
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
          alert.error(data?.message);
        }
      } catch (error) {
        alert.error(error);
      }
    };
    fetchMyInfo();
  }, [alert]);

  return (
    <>
      <Topbar user={user} />
      <div className="homeContainer">
        <Sidebar user={user}/>
        <Feed user={user} />
        <Rightbar user={user} />
      </div>
    </>
  );
}
