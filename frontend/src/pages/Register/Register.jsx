import React, { useState ,Fragment} from "react";
import Modal from "react-modal";
import "./Register.css";
import Select from "react-select";
import "./Register2.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import Loader from "../../components/Loader/Loader.js";

const defaultHobbies = ["Reading", "Singing", "Coding", "Dancing"];

const defaultInterests = ["Football", "women", "men", "friendship", "love"];

const Register = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    contactNo: "",
    DOB: "",
    martialStatus: "",
    gender: "",
    interests: [],
    hobbies: [],
    department: "",
    branch: "",
    yearOfStudy: "",
  });

  const navigate = useNavigate();

  const branchOptions = [
    { value: "", label: "Select Branch", isDisabled: true },
    { value: "CSE", label: "CSE" },
    { value: "Civil", label: "Civil" },
    { value: "Electrical", label: "Electrical" },
    { value: "Mechanical", label: "Mechanical" },
    { value: "Other", label: "Other" },
  ];
  const departmentOptions = [
    { value: "", label: "Select Department", isDisabled: true },
    { value: "B-Tech", label: "B-Tech" },
    { value: "Pharmacy", label: "Pharmacy" },
    { value: "BCA", label: "BCA" },
    { value: "LAW", label: "LAW" },
    { value: "Other", label: "Other" },
  ];
  const yearOfStudyOptions = [
    { value: "", label: "Select Year", isDisabled: true },
    { value: "1", label: "1 year" },
    { value: "2", label: "2 year" },
    { value: "3", label: "3 year" },
    { value: "4", label: "4 year" },
    { value: "Other", label: "Other" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "200px",
    }),
    option: (provided, state) => ({
      ...provided,
      width: "200px",
      padding: "8px",
      borderBottom: "1px solid #ccc",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: state.isSelected ? "#fff" : "#333",
    }),
  };

  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isHobbyModalOpen, setIsHobbyModalOpen] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newHobbies, setNewHobbies] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      // Append other form fields
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("contactNo", formData.contactNo);
      formDataToSend.append("DOB", formData.DOB.substring(0, 11));
      formDataToSend.append("martialStatus", formData.martialStatus);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("branch", formData.branch);
      formDataToSend.append("yearOfStudy", formData.yearOfStudy);

      // Append the avatar file
      formDataToSend.append("avatar", formData.avatar);

      // Append interests and hobbies as arrays
      formData.interests.forEach((interest) => {
        formDataToSend.append("interests", interest);
      });

      formData.hobbies.forEach((hobby) => {
        formDataToSend.append("hobbies", hobby);
      });
      setLoading(true);
      const { data } = await axios.post(
        `${serverUrl}/user/register`,
        formDataToSend,
        { withCredentials: true }
      );
      console.log("data is", data);
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        // const errorResponse = await response.json();
        toast.error(data.message);
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "DOB") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      if (selectedDate > currentDate) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "Invalid date." }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }

    if (name === "contactNo") {
      if (value.length !== 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Contact number must be 10 digits.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }

    if (
      type === "text" ||
      type === "email" ||
      type === "password" ||
      type === "date" ||
      type === "number"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (type === "checkbox") {
      if (name.startsWith("interest")) {
        // Handle changes for interests checkboxes
        setFormData((prevData) => ({
          ...prevData,
          interests: checked
            ? [...prevData.interests, value]
            : prevData.interests.filter((interest) => interest !== value),
        }));
      } else if (name.startsWith("hobby")) {
        // Handle changes for hobbies checkboxes
        setFormData((prevData) => ({
          ...prevData,
          hobbies: checked
            ? [...prevData.hobbies, value]
            : prevData.hobbies.filter((hobby) => hobby !== value),
        }));
      }
    } else if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleListChange = (selectedOption, actionMeta) => {
    if (
      actionMeta.name === "department" ||
      actionMeta.name === "branch" ||
      actionMeta.name === "yearOfStudy"
    ) {
      setFormData({
        ...formData,
        [actionMeta.name]: selectedOption.value,
      });
    }
  };

  const handleAvatarChange = (e) => {
    const avatarFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      avatar: avatarFile,
    }));
  };
  const handleCoverImage = (e) => {
    const coverFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      coverImage: coverFile,
    }));
  };

  const openInterestModal = () => setIsInterestModalOpen(true);
  const closeInterestModal = () => setIsInterestModalOpen(false);
  const openHobbyModal = () => setIsHobbyModalOpen(true);
  const closeHobbyModal = () => setIsHobbyModalOpen(false);
  const handleInterestChange = (e) => setNewInterest(e.target.value);
  const handleAddHobbyChange = (e) => setNewHobbies(e.target.value);

  const handleAddInterest = () => {
    setFormData({
      ...formData,
      interests: [...formData.interests, newInterest],
    });
    setNewInterest("");
    closeInterestModal();
  };

  const handleAddHobby = () => {
    setFormData({
      ...formData,
      hobbies: [...formData.hobbies, newHobbies],
    });
    setNewHobbies("");
    closeHobbyModal();
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="register-container">
          <h2 className="register-header">Register</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <label className="register-label">
              Avatar:
              <input
                className="register-input loginInput"
                type="file"
                name="avatar"
                onChange={handleAvatarChange}
                required
              />
            </label>
            <label className="register-label">
              CoverImage:
              <input
                className="register-input loginInput"
                type="file"
                name="coverImage"
                onChange={handleCoverImage}
                // required
              />
            </label>

            <label className="register-label">
              Full Name:
              <input
                className="register-input loginInput"
                type="text"
                name="fullname"
                value={formData.fullname}
                placeholder="Enter your full Name"
                onChange={handleChange}
                required
              />
            </label>

            <label className="register-label">
              Username:
              <input
                className="register-input loginInput"
                type="text"
                name="username"
                value={formData.username}
                placeholder="Enter your Username"
                onChange={handleChange}
                required
              />
            </label>

            <label className="register-label">
              Email:
              <input
                className="register-input loginInput"
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your Email"
                onChange={handleChange}
                required
              />
            </label>

            <label className="register-label">
              Password:
              <input
                className="register-input loginInput"
                type="password"
                name="password"
                value={formData.password}
                placeholder="Enter your Password"
                onChange={handleChange}
                required
              />
            </label>

            <label className="register-label">
              Contact Number:
              <input
                className="register-input loginInput"
                type="number"
                name="contactNo"
                value={formData.contactNo}
                maxLength={10}
                placeholder="Enter your ContactNo"
                onChange={handleChange}
                // required
              />
              {errors.contactNo && (
                <span className="error-message">{errors.contactNo}</span>
              )}
            </label>

            <label className="register-label">
              Date of Birth:
              <input
                className="register-input loginInput"
                type="date"
                name="DOB"
                value={formData.DOB}
                placeholder="Enter your D.O.B"
                onChange={handleChange}
                // required
              />
              {errors.DOB && (
                <span className="error-message">{errors.DOB}</span>
              )}
            </label>

            <label className="register-label">
              Martial Status:
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    className="register-radio-input"
                    type="radio"
                    name="martialStatus"
                    value="Single"
                    checked={formData.martialStatus === "Single"}
                    onChange={handleChange}
                    required
                  />
                  Single
                </label>
                <label className="register-radio-label">
                  <input
                    className="register-radio-input"
                    type="radio"
                    name="martialStatus"
                    value="Coupled"
                    checked={formData.martialStatus === "Coupled"}
                    onChange={handleChange}
                    required
                  />
                  Coupled
                </label>
              </div>
            </label>

            <label className="register-label">
              Gender:
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    className="register-radio-input"
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                    required
                  />
                  Male
                </label>
                <label className="register-radio-label">
                  <input
                    className="register-radio-input"
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                    required
                  />
                  Female
                </label>
                <label className="register-radio-label">
                  <input
                    className="register-radio-input"
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === "Other"}
                    onChange={handleChange}
                    required
                  />
                  Other
                </label>
              </div>
            </label>

            <label className="register-label">
              Hobbies:
              <button
                className="add-interest-button loginButton"
                type="button"
                onClick={openHobbyModal}
              >
                Add Hobbies
              </button>
              <textarea
                className="register-textarea"
                type="text"
                name="hobbies"
                value={formData.hobbies.join("\n")}
                onChange={handleChange}
                required
              />
            </label>

            <Modal
              isOpen={isHobbyModalOpen}
              onRequestClose={closeHobbyModal}
              contentLabel="Select Hobbies Modal"
              className="modal"
              overlayClassName="overlay"
            >
              <h2>Select Hobbies</h2>
              <div className="interest-options">
                {defaultHobbies.map((hobby) => (
                  <label key={hobby} className="interest-checkbox-label">
                    <input
                      type="checkbox"
                      name={`hobby_${hobby}`}
                      value={hobby}
                      checked={formData.hobbies.includes(hobby)}
                      onChange={handleChange}
                    />
                    {hobby}
                  </label>
                ))}
              </div>
              <input
                type="text"
                value={newHobbies}
                onChange={handleAddHobbyChange}
                placeholder="Enter new Hobbies"
              />
              <button onClick={handleAddHobby} className="loginButton">
                Add
              </button>
              <button onClick={closeHobbyModal} className="loginButton">
                Close
              </button>
            </Modal>

            <label className="register-label">
              Interests:
              <button
                className="add-interest-button loginButton"
                type="button"
                onClick={openInterestModal}
              >
                Add Interests
              </button>
              <textarea
                className="register-textarea"
                type="text"
                name="interests"
                value={formData.interests.join("\n")}
                onChange={handleChange}
                required
              />
            </label>

            <Modal
              isOpen={isInterestModalOpen}
              onRequestClose={closeInterestModal}
              contentLabel="Select Interests Modal"
              className="modal"
              overlayClassName="overlay"
            >
              <h2>Select Interests</h2>
              <div className="interest-options">
                {defaultInterests.map((interest) => (
                  <label key={interest} className="interest-checkbox-label">
                    <input
                      type="checkbox"
                      name={`interest_${interest}`}
                      value={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={handleChange}
                    />
                    {interest}
                  </label>
                ))}
              </div>
              <input
                type="text"
                value={newInterest}
                onChange={handleInterestChange}
                placeholder="Enter new interest"
              />
              <button onClick={handleAddInterest} className="loginButton">
                Add
              </button>
              <button onClick={closeInterestModal} className="loginButton">
                Close
              </button>
            </Modal>

            <label className="register-label">
              Department:
              <Select
                name="department"
                options={departmentOptions}
                value={departmentOptions.find(
                  (option) => option.value === formData.department
                )}
                onChange={(selectedOption, actionMeta) =>
                  handleListChange(selectedOption, actionMeta)
                }
                styles={customStyles}
              />
            </label>

            <label className="register-label">
              Branch:
              <Select
                name="branch"
                options={branchOptions}
                value={branchOptions.find(
                  (option) => option.value === formData.branch
                )}
                onChange={(selectedOption, actionMeta) =>
                  handleListChange(selectedOption, actionMeta)
                }
                styles={customStyles}
              />
            </label>

            <label className="register-label">
              Year of Study:
              <Select
                name="yearOfStudy"
                options={yearOfStudyOptions}
                value={yearOfStudyOptions.find(
                  (option) => option.value === formData.yearOfStudy
                )}
                onChange={(selectedOption, actionMeta) =>
                  handleListChange(selectedOption, actionMeta)
                }
                styles={customStyles}
              />
            </label>

            <button className="register-button loginButton" type="submit">
              Register
            </button>
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default Register;
