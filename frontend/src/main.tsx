import { createRoot } from "react-dom/client";
import "./index.css";
import * as React from "react";
import "./index.css";
import { App } from "./screens/App.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
