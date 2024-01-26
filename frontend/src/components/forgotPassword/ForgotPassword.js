import React, { useState } from "react";
import ForgotPasswordContainer from "./ForgotPasswordContainer.js";
import axios from "axios";
import { useAlert } from "react-alert";
import { serverUrl } from "../../constants.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setMessage("");
  };

  const handleSendResetLink = async () => {
    try {
      setIsLoading(true);
      const {data} = await axios.post(`${serverUrl}/user/forgot/password`, {
        email,
      },{withCredentials:true});
      if(data?.success){
        alert.success(data?.message)
        setMessage("")
      }else{
        alert.error(data?.message)
      }
    } catch (error) {
      console.error("Error:", error);
      alert.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <button onClick={handleSendResetLink} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
        <p
          className={
            message.includes("Error") ? "error-message" : "success-message"
          }
        >
          {message}
        </p>
      </div>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
