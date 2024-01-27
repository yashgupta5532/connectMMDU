import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";

const defaultHobbies = ["Reading", "Singing", "Coding", "Dancing"];

const defaultInterests = ["Football", "women", "men", "friendship", "love"];

const UpdateUser = () => {
  const [formData, setFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/user/myDetails`, {
          withCredentials: true,
        });
        if (data?.success) {
          setUser(data?.data);
          setFormData(data?.data);
          setInitialFormData(data?.data);
        } else {
          // toast.error(data?.message);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    };
    fetchMyInfo();
  }, []);

  const [errors, setErrors] = useState({});

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

      // Append only fields that have changed
      for (const [field, value] of Object.entries(formData)) {
        if (value !== initialFormData[field]) {
          // Compare with initial values
          formDataToSend.append(field, value);
        }
      }

      const uniqueInterests = new Set(
        formData.interests.map((interest) => interest.trim())
      );
      formDataToSend.append("interests", [...uniqueInterests].join(","));

      // For hobbies:
      const uniqueHobbies = new Set(
        formData.hobbies.map((hobby) => hobby.trim())
      );
      formDataToSend.append("hobbies", [...uniqueHobbies].join(","));

      console.log("formdata to send is ", formDataToSend);
      if (formDataToSend.avatar) {
        console.log("inside formData avatar");
        const { data } = await axios.patch(
          `${serverUrl}/user/avatar`,
          {},
          {
            withCredentials: true,
          }
        );
        console.log("data is avatar ", data);
        if (data?.success) {
          setFormData(data?.data);
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      }

      const { data } = await axios.put(
        `${serverUrl}/user/update/profile`,
        formDataToSend,
        { withCredentials: true }
      );
      console.log("data is updated ", data);
      if (data?.success) {
        setFormData(data?.data);
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Error during updating profile:", error);
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
        setFormData((prevData) => ({
          ...prevData,
          interests: checked
            ? [...prevData.interests, value.trim()]
            : prevData.interests.filter(
                (interest) => interest !== value.trim()
              ),
        }));
      } else if (name.startsWith("hobby")) {
        setFormData((prevData) => ({
          ...prevData,
          hobbies: checked
            ? [...prevData.hobbies, value.trim()]
            : prevData.hobbies.filter((hobby) => hobby !== value.trim()),
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
    const Reader = new FileReader();
    Reader.readAsDataURL(avatarFile);
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setFormData((prevData) => ({
          ...prevData,
          avatar: Reader.result,
        }));
      }
    };
  };

  const openInterestModal = () => setIsInterestModalOpen(true);
  const closeInterestModal = () => setIsInterestModalOpen(false);
  const openHobbyModal = () => setIsHobbyModalOpen(true);
  const closeHobbyModal = () => setIsHobbyModalOpen(false);
  const handleInterestChange = (e) => setNewInterest(e.target.value);
  const handleAddHobbyChange = (e) => setNewHobbies(e.target.value);

  const handleAddInterest = () => {
    // Ensure uniqueness and trim whitespace:
    setFormData((prevFormData) => ({
      ...prevFormData,
      interests: [...new Set([...prevFormData.interests, newInterest.trim()])],
    }));
    // setNewInterest("");  // Uncomment if needed to clear the input field
    closeInterestModal();
  };

  const handleAddHobby = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      hobbies: [...new Set([...prevFormData.hobbies, newHobbies.trim()])],
    }));
    // setNewHobbies("");
    closeHobbyModal();
  };

  return (
    <div className="register-container">
      <h2 className="register-header">Update Profile...</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label">
          {<img width={40} height={40} src={formData.avatar} alt="user" />}:
          Avatar
          <input
            className="register-input loginInput"
            type="file"
            name="avatar"
            onChange={handleAvatarChange}
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
          />
        </label>
        <label className="register-label">
          Status :
          <input
            className="register-input loginInput"
            type="text"
            name="status"
            value={formData.status}
            placeholder="Enter your Status"
            onChange={handleChange}
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
          />
        </label>

        <label className="register-label">
          Email:
          <input
            className="register-input loginInput"
            type="email"
            name="email"
            value={formData.email}
            disabled
            placeholder="Enter your Email"
            onChange={handleChange}
          />
        </label>

        {/* <label className="register-label">
          Password:
          <input
            className="register-input loginInput"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter your Password"
            onChange={handleChange}
            
          />
        </label> */}

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
            value={formData?.DOB?.substring(0, 10)}
            placeholder="Enter your D.O.B"
            onChange={handleChange}
          />
          {errors.DOB && <span className="error-message">{errors.DOB}</span>}
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
            readOnly
            name="hobbies"
            value={formData.hobbies?.join("\n")}
            onChange={handleChange}
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
                  checked={formData.hobbies?.includes(hobby)}
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
            readOnly
            name="interests"
            value={formData.interests?.join("\n")}
            onChange={handleChange}
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
                  checked={formData.interests?.includes(interest)}
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
            value={
              yearOfStudyOptions.find(
                (option) => option.value === String(formData?.yearOfStudy)
              ) ?? yearOfStudyOptions[0]
            } // Default value
            onChange={(selectedOption, actionMeta) =>
              handleListChange(selectedOption, actionMeta)
            }
            styles={customStyles}
          />
        </label>

        <button className="register-button loginButton" type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
