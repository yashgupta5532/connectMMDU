import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Modal from "react-modal";

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};

const root = ReactDOM.createRoot(document.getElementById("root"));

Modal.setAppElement("#root");
root.render(
  <>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </>
);
