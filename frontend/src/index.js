import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "react-modal";

const options = {
  position: 'bottom-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};


const root = ReactDOM.createRoot(document.getElementById("root"));

Modal.setAppElement("#root");
root.render(
  <React.StrictMode>
    <ToastContainer {...options} />
      <App />
  </React.StrictMode>
);
