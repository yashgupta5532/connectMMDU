import React, { Fragment, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { clearErrors, loginUser } from "../../Actions/UserAction.js";
import { useAlert } from "react-alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials
        body: JSON.stringify({ email, password }),
      });
      const cookies = document.cookie;
      console.log("cookies in frontend ", cookies);

      if (response.ok) {
        const { data } = await response.json();
        console.log("Server response:", data);
        alert.success("Logged in successfully");
        navigate("/friend/suggest");
        // setUser(data.user);
      } else {
        const errorMessage = await response.text();
        if (response.status === 401) {
          alert.error("Invalid email or password");
        } else {
          alert.error(`Error while logging in: ${errorMessage}`);
        }
        console.error(`Error while logging in: ${errorMessage}`);
      }
    } catch (error) {
      alert.error("Error during login. Please try again.");
      console.error("Error during login:", error.message);
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
