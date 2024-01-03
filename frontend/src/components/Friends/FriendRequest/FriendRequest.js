import React, { Fragment } from "react";
import "./FriendRequest.css";

const user = {
  name: "Babu Gupta",
  FriendsCount: 50,
  image:
    "https://scontent.fdel27-1.fna.fbcdn.net/v/t39.30808-1/405190742_122094454016137510_232655995027735425_n.jpg?stp=dst-jpg_p240x240&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=JR-yMOictIgAX8R5nhP&_nc_ht=scontent.fdel27-1.fna&oh=00_AfAC7X_NL1cmZSPA7rfLlhphuErsKs16vfvYOzyz1khrEA&oe=65878A14",
};

const FriendRequest = () => {
  return (
    <Fragment>
      <div className="friend-request-container">
        <div className="friend-user-container">
          <div className="images">
            <img src={user.image} alt="img" />
          </div>
          <div className="name">
            <h3>{user.name}</h3>
          </div>
          <div className="friends-count">
            <img src={user.image} alt="" />
            <p>{user.FriendsCount} mutual Friends</p>
          </div>
          <button className="btn-confirm">Confirm</button>
          <button className="btn-delete">Delete</button>
        </div>
      </div>
    </Fragment>
  );
};

export default FriendRequest;
