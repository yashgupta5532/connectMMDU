import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { Link } from "react-router-dom";
import "./AllUsers.css";

const AllUsers = (message = false) => {
  const [allUser, setAllUsers] = useState([]);

  const currentUtcDate = new Date().toISOString();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/user/admin/all-users`, {
          withCredentials: true,
        });
        // console.log("data users admin", data);
        if (data?.success) {
          setAllUsers(data?.data);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        // if (
        //   error.response &&
        //   error.response.data &&
        //   error.response.data.message
        // ) {
        //   toast.error(error.response.data.message);
        // } else {
        //   toast.error("An unexpected error occurred.");
        // }
      }
    };
    fetchAllUsers();
  }, []);

  const handleBlockUser = async (userId, status) => {
    try {
      let data;
      if (status === "Block") {
        ({ data } = await axios.put(
          `${serverUrl}/user/block/${userId}`,
          {},
          { withCredentials: true }
        ));
      } else if (status === "Un-Block") {
        ({ data } = await axios.put(
          `${serverUrl}/user/un-block/admin/${userId}`,
          {},
          { withCredentials: true }
        ));
      }

      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
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

  const handleDeleteUser = async (userId) => {
    try {
      const { data } = await axios.delete(
        `${serverUrl}/user/delete/profile/admin/${userId}`,
        { withCredentials: true }
      );
      console.log("data in del", data);
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
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

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/user/update/admin/role/${userId}`,
        { newRole },
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
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
      <div className="auto-container">
        <ul className="admin-users-ulist">
          {allUser &&
            allUser.map((user) => (
              <li className="admin-users-list" key={user?._id}>
                <div className="all-users">
                  <Link
                    to={`${
                      message
                        ? `/message/${user?._id}`
                        : `/profile/${user?._id}`
                    }`}
                  >
                    <li className="sidebarFriend" key={user?._id}>
                      <img
                        className="sidebarFriendImg"
                        src={user?.avatar}
                        alt=""
                      />
                      <span className="sidearFriendName">{user?.username}</span>
                    </li>
                    <span className="sidearFriendName">{user?.email}</span>
                  </Link>
                  {/* <div className="button-container"> */}
                  <button
                    className="block"
                    onClick={() => {
                      handleBlockUser(
                        user?._id,
                        user?.accountBlockedUntil > currentUtcDate
                          ? "Un-Block"
                          : "Block"
                      );
                    }}
                  >
                    {user?.accountBlockedUntil > currentUtcDate
                      ? "Un-Block"
                      : "Block"}
                  </button>

                  <button
                    className="delete"
                    onClick={() => {
                      handleDeleteUser(user?._id);
                    }}
                  >
                    Delete
                  </button>

                  <button
                    className="makeAdmin"
                    onClick={() => {
                      handleUpdateRole(
                        user?._id,
                        `${user?.role === "user" ? "admin" : "user"}`
                      );
                    }}
                  >
                    {user?.role}
                  </button>
                  {/* </div> */}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default AllUsers;
