import React, { useEffect, useState, Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import FriendRequest from "./components/Friends/FriendRequest/FriendRequest.js";
import AllFriends from "./components/Friends/AllFriends/AllFriends.js";
import Message from "./components/Message/MessageHeader.js";
import Contact from "./components/Contact/Contact.js";
import UpdateUser from "./components/updateUser/UpdateUser.js";
import AdminDashboard from "./components/Admin/AdminDashboard.js";
import ContactInfo from "./components/Admin/ContactInfo.js";
import ForgotPassword from "./components/forgotPassword/ForgotPassword.js";
import ResetPassword from "./components/forgotPassword/ResetPassword.js";
import axios from "axios";
import { serverUrl } from "./constants.js";
import { toast } from "react-toastify";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/user/myDetails`, {
          withCredentials: true,
        });

        if (data?.success) {
          setUser(data?.data);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.error("Error:", error);
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

    fetchMyInfo();
  }, []);

  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={user ? <Home /> : <Login />} />

          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/friend/request" element={<FriendRequest />} />
          <Route path="/friend/all" element={<AllFriends />} />
          <Route path="/message/:userId" element={<Message />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/update/profile" element={<UpdateUser />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/all-contact" element={<ContactInfo />} />
          <Route path="/forgot/password" element={<ForgotPassword />} />
          <Route path="/reset/password/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
