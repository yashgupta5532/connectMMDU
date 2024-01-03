import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";

const user = [{
  _id: "6579adaa2273a1c6147c2615",
  name: "Babu Gupta",
  FriendsCount: 50,
  image:
    "https://scontent.fdel27-1.fna.fbcdn.net/v/t39.30808-1/405190742_122094454016137510_232655995027735425_n.jpg?stp=dst-jpg_p240x240&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=JR-yMOictIgAX8R5nhP&_nc_ht=scontent.fdel27-1.fna&oh=00_AfAC7X_NL1cmZSPA7rfLlhphuErsKs16vfvYOzyz1khrEA&oe=65878A14",
}];

const Suggestion = () => {
  const alert = useAlert();
  const [suggestedFriends, setSuggestedFriends] = useState(user);

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/user/find/matchers",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestedFriends(data.users);
        } else {
          console.error(
            "Failed to fetch suggested friends:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    };

    fetchSuggestedFriends();
  }, []); 

  const sendFriendRequest = async (userId) => {
    console.log("clicked", userId);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/user/sendFriendRequest/${userId}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (data.success) {
        alert.success(data.message);
      } else {
        alert.error("Error", data.message);
      }
    } catch (error) {
      alert.error(error.message);
    }
  };

  return (
    <Fragment>
      {suggestedFriends.map((friend) => (
        <div key={friend._id} className="friend-request-container">
          <div className="friend-user-container">
            <div className="images">
              <img src={friend.image} alt="img" />
            </div>
            <div className="name">
              <h3>{friend.name}</h3>
            </div>
            <div className="friends-count">
              <img src={friend.image} alt="" />
              <p>{friend.FriendsCount} mutual Friends</p>
            </div>
            <button
              className="btn-delete"
              onClick={() => sendFriendRequest(friend._id)}
            >
              Add Friend
            </button>
            <button className="btn-confirm">Remove</button>
          </div>
        </div>
      ))}
    </Fragment>
  );
};

export default Suggestion;
