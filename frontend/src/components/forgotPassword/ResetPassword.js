import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Fragment } from "react";
import "./ResetPassword.css";
import { useAlert } from "react-alert";
import { serverUrl } from "../../constants";

function ResetPassword() {
  const { token } = useParams();
  console.log("token is",token)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const alert = useAlert();
  const navigate = useNavigate();
  const handleResetPassword = async () => {
    try {
      const { data } = await axios.post(
        `${serverUrl}/user/reset/password/${token}`,
        {
          newPassword: password,
          confirmPassword,
        },
        { withCredentials: true }
      );
      console.log(data);
      if (data?.success) {
        console.log(data?.message);
        alert.success(data?.message);
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        alert.error(data?.message);
      }
    } catch (error) {
      alert.error(error);
    }
  };

  return (
    <Fragment>
      <div className="reset-password-container">
        <form className="reset-password-form">
          <h2 className="reset-password-title">Reset Your Password</h2>
          <input
            className="reset-password-input"
            type="password"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="reset-password-input"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="reset-password-button"
            type="button"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </form>
      </div>
    </Fragment>
  );
}

export default ResetPassword;
