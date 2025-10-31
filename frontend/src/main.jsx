import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <Navbar />
      <App />
    </UserProvider>
  </BrowserRouter>
);
