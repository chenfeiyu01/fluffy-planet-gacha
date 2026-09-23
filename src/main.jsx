import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import MobileExperience from "./components/MobileExperience";
import "./mobile-experience.css";
import BootScreen from "./components/BootScreen";
import "./style.css";
import "./refinement.css";
createRoot(document.getElementById("root")).render(
  <MobileExperience>
  <BootScreen>
    <App />
  </BootScreen>
  </MobileExperience>,
);
