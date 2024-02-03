import React from "react";
import { Link } from "react-router-dom";
import "./Block.css";

const Block = () => {
  return (
    <div className="blocked-user-container">
      <h1>Your Account is Blocked</h1>
      <p>
        We're sorry, but your account is currently blocked. If you believe this
        is an error or if you have any questions, please contact support.
      </p>
      <div className="flex-container">
        <Link to="/contact" className="contact-link">
          Contact Support
        </Link>
        <Link to="/login" className="contact-link">
          Login with another A/c
        </Link>
      </div>
    </div>
  );
};

export default Block;
