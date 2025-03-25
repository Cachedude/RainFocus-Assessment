import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddEditEvent from "./AddEditEvent";
import App from "./App";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add" element={<AddEditEvent />} />
        <Route path="/edit/:id" element={<AddEditEvent />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
