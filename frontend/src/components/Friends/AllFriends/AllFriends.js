import React, { Fragment, useState } from "react";
import "./AllFriends.css";

const user = [
  {
    bg: "https://imgs.search.brave.com/tf-7hccTPMjeM0BMI0Y-U4jZi3i5U25wfsMh5XsKPxw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZm90b3IuY29t/L2FwcC9mZWF0dXJl/cy9pbWcvc3RlcF9u/ZXcvY2FyL2Z0X2Jn/X3N0ZXBfY2FyMi5q/cGc",
    avatar:
      "https://imgs.search.brave.com/XC2mo6jN6dXXMVok6zis3c9_00kGCH8WhZD-Ust_qO4/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9kNW51/bnlhZ2NpY2d5LmNs/b3VkZnJvbnQubmV0/L2V4dGVybmFsX2Fz/c2V0cy9oZXJvX2V4/YW1wbGVzL2hhaXJf/YmVhY2hfdjM5MTE4/MjY2My9vcmlnaW5h/bC5qcGVn",
  },
];

const AllFriends = () => {
  const [allFriends, setAllFriends] = useState(user);
  return (
    <Fragment>
      <div className="profile-container-header">
        {allFriends &&
          allFriends.map((user) => (
            <div className="profile-container">
              <div className="bg-img">
                <img src={user.bg} alt="imaging" />
              </div>
              <div className="user-info">
                <div className="info">
                  <div className="avatar">
                    <img src={user.avatar} alt="imaging" />
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
