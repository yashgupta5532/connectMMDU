import React, { Fragment } from "react"
import "./App.css"
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Home from "./pages/home/Home.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import FriendRequest from "./components/Friends/FriendRequest/FriendRequest.js";
import AllFriends from "./components/Friends/AllFriends/AllFriends.js"
import Message from "./components/Message/MessageHeader.js"

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/user/profile" element={<Profile/>}/>
          <Route path="/friend/request" element={<FriendRequest/>}/>
          <Route path="/friend/all" element={<AllFriends/>}/>
          <Route path="/message" element={<Message/>}/>
        </Routes>
      </Router>
    </Fragment>
  )
}

export default App;
