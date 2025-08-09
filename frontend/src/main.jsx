import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Layout from "./Layout.jsx";
import Toukou from "./Pages/Toukou/Toukou.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<App />} />
          <Route path="toukou" element={<Toukou />} />
          <Route path="about" element={<div>About Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
