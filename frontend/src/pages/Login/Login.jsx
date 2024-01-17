import "./login.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { serverUrl } from "../../constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${serverUrl}/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (data.success) {
        alert.success(data.message);
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
      alert.error(`${error.response.data.message}`);
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">NewSocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on NewSocial
          </span>
        </div>
        <div className="loginRight">
          <form onSubmit={handleSubmit}>
            <div className="loginBox">
              <input
                placeholder="Email"
                className="loginInput"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                placeholder="Password"
                className="loginInput"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="loginButton" type="submit">
                Log In
              </button>
              <Link to="/forgot/password" className="text-center">
                <span className="loginForgot">Forgot Password?</span>
              </Link>
              <Link to="/register" className="text-center">
                <button className="loginRgisterButton">
                  Create a new Account
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
