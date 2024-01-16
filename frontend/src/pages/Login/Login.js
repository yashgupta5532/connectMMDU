import React, { Fragment, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { clearErrors, loginUser } from "../../Actions/UserAction.js";
import { useAlert } from "react-alert";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        {
          email,
          password,
        }
        , { withCredentials: true }
      );
      if (data.success) {
        alert.success(data.message);
        navigate("/friend/suggest");
      }
    } catch (error) {
      console.log("error", error);
      alert.error(`${error.response.data.message}`);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   try {
  //     dispatch(loginUser(email, password));
  //   } catch (error) {
  //     alert.error(error.message);
  //   }
  // };

  return (
    <Fragment>
      <div className="login-contaier">
        <form onSubmit={handleSubmit}>
          <h2>Login form</h2>
          <div className="email">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="submit">
            <button type="submit">Login</button>
          </div>
          <Link to="/">Already Logged In, visit Home Page</Link>
          <Link to="/register">Go to Register Page</Link>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
