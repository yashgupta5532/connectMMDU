import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Fragment } from "react";
import "./ResetPassword.css";
import { toast } from "react-toastify";
import { serverUrl } from "../../constants.js";

function ResetPassword() {
  const { token } = useParams();
  console.log("token is", token);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        toast.success(data?.message);
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
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
