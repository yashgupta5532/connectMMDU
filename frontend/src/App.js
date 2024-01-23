import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import FriendRequest from "./components/Friends/FriendRequest/FriendRequest.js";
import AllFriends from "./components/Friends/AllFriends/AllFriends.js";
import Message from "./components/Message/MessageHeader.js";
import Contact from "./components/Contact/Contact.js";
import UpdateUser from "./components/updateUser/UpdateUser.js";
// import SocketApp from "./components/socket/SocketApp.js"
// import { io } from "socket.io-client";


function App() {

  // const socket = io("http://localhost:8000");
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("connected", socket.id);
  //   });

  //   socket.on("message", (msg) => {
  //     console.log(msg);
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);


  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path={`/profile/:userId`}
            element={<Profile />}
          />
          <Route path="/friend/request" element={<FriendRequest />} />
          <Route path="/friend/all" element={<AllFriends />} />
          <Route path="/message/:userId" element={<Message />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/update/profile" element={<UpdateUser />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
