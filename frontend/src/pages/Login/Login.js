import React, { Fragment, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user,setUser]=useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const {data} = await response.json()
        console.log("data is",data)
        setUser(data.user)

      } else {
        const errorMessage = await response.text();
        console.error(`Error while logging in: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

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
