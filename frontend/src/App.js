import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/layout/Home/Home.js";
import MessageHeader from "./components/Message/MessageHeader.js";
import Register from "./pages/Register/Register.js";
import Login from "./pages/Login/Login.js";
import UserCard from "./components/UserAdmin/UserCard.js";
import FriendRequest from "./components/Friends/FriendRequest/FriendRequest.js";
import Suggestion from "./components/Friends/Suggestion/Suggestion.js";

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/message" element={<MessageHeader />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/friend/request" element={<FriendRequest />} />
          <Route path="/friend/suggest" element={<Suggestion />} />
          <Route path="/user" element={<UserCard />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
