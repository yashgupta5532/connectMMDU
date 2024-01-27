import React, { useEffect, useState, Fragment } from "react";
import "./ContactInfo.css"; // Import your CSS file
import { toast } from "react-toastify";
import axios from "axios";
// import { Link } from "react-router-dom";
import { serverUrl } from "../../constants.js";

const ContactInfo = () => {
  const [contactFormSubmissions, setContactFormSubmissions] = useState([]);

  useEffect(() => {
    const fetchAllContact = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/contact/admin/all-contact`,
          { withCredentials: true }
        );
        if (data?.success) {
          setContactFormSubmissions(data?.data);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.error("Error:", error);

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
    fetchAllContact();
  }, [toast]);

  return (
    <Fragment>
      <div className="contact-container">
        <h1 className="contact-title">Contact Form Submissions</h1>
        <ul className="submission-list">
          {contactFormSubmissions.map((submission) => (
            <li key={submission._id} className="submission-item">
              <div className="contact-form-info">
                <h4 className="submission-user">
                  Submitted by: {submission.name}
                </h4>
                <p className="submission-email">Email: {submission.email}</p>
                <p className="submission-contact">
                  Contact Number: {submission.contactNo}
                </p>
                <p className="submission-message">
                  Message: {submission.message}
                </p>
                <p className="submission-date">
                  Submitted At:{" "}
                  {new Date(submission.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default ContactInfo;
