import React from "react";
import "./ComingSoon.css";

const ComingSoon = () => {
  return (
    <div className="coming-soon-container box-shadow-coming">
      <img
        src="/assets/bg.png" // Replace with your logo or image
        alt="Logo"
        className="logo-coming animation-coming"
      />
      <div className="title">Coming Soon</div>
      <div className="subtitle">We are working on something awesome!</div>
    </div>
  );
};

export default ComingSoon;
