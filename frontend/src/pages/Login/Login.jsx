import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Loader from "../../components/Loader/Loader.js";
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUrl}/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="login">
          <div className="loginWrapper">
            <div className="loginLeft">
              <h3 className="loginLogo">Connect-MMDU</h3>
              <span className="loginDesc">
                Connect with friends and the world around you on Connect-MMDU
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
                    required
                  />
                  <div className="passwordInputContainer">
                    <input
                      placeholder="Password"
                      className="loginInput"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {showPassword ? (
                      <VisibilityOffIcon
                        className="eye-icon"
                        onClick={handleTogglePassword}
                      />
                    ) : (
                      <RemoveRedEyeIcon
                        className="eye-icon"
                        onClick={handleTogglePassword}
                      />
                    )}
                  </div>
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
      )}
    </Fragment>
  );
};

export default Login;
