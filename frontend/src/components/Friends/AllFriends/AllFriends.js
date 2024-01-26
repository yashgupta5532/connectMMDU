import React, { Fragment, useEffect, useState } from "react";
import "./AllFriends.css";
import axios from "axios";
import { serverUrl } from "../../../constants.js";
import { useAlert } from "react-alert";

const AllFriends = () => {
  const [allFriends, setAllFriends] = useState([]);
  const alert = useAlert();
  useEffect(() => {
    const fetchAllFriends = async () => {
      try {
        const {data} = await axios.get(`${serverUrl}/user/all/friends`,{
          withCredentials: true,
        });
        // console.log("data res",data);
        if (data?.success) {
          setAllFriends(data?.data);
        } else {
          alert.error(data?.message);
        }
      } catch (error) {
        alert.error(error);
      }
    };
    fetchAllFriends();
  }, [alert]);

  // console.log("all friends ",allFriends)
  return (
    <Fragment>
      <div className="profile-container-header">
        {allFriends &&
          allFriends.map((user) => (
            <div key={user?._id} className="profile-container">
              <div className="bg-img">
                <img  src={user?.coverImage} alt="imaging" />
              </div>
              <div className="user-info">
                <div className="info">
                  <div className="avatar">
                    <img src={user?.avatar} alt="imaging" />
                  </div>
                  <button className="follow">Following</button>
                </div>
                <div className="">
                  <h3>Full name</h3>
                  <p>some thing status</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );
};

export default AllFriends;
