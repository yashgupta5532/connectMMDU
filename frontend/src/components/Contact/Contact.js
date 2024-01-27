import React, { useState } from "react";
import "./Contact.css";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    contactNo: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming formData contains the form fields
    const dataToSend = {
      name: formData.name,
      address: formData.address,
      email: formData.email,
      contactNo: formData.contactNo,
      message: formData.message,
    };

    // Send a POST request to your backend API
    try {
      const { data } = await axios.post(
        `${serverUrl}/contact/create-contact`,
        dataToSend,
        { withCredentials: true }
      );
      console.log("data is ", data);
      if (data?.success) {
        toast.success(data.message);
        setFormData({
          name: "",
          address: "",
          email: "",
          contactNo: "",
          message: "",
        });
      } else {
        // Ensure that the error message is a string
        toast.error(data?.message.toString());
      }
    } catch (error) {
      // Ensure that the error message is a string
      toast.error(error.toString());
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="name">
            <i className="fas fa-user"></i>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="loginInput"
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="address">
            <i className="fas fa-map-marker-alt"></i>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="loginInput"
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="email">
            <i className="fas fa-envelope"></i>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="loginInput"
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="contactNo">
            <i className="fas fa-phone"></i>
          </label>
          <input
            type="tel"
            id="contactNo"
            name="contactNo"
            placeholder="Contact No"
            value={formData.contactNo}
            onChange={handleChange}
            className="loginInput"
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="message">
            <i className="fas fa-comment"></i>
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="loginInput"
            required
          ></textarea>
        </div>
        <button type="submit" className="loginButton">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Contact;
