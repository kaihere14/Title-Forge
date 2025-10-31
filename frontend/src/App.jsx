import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";

import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import PaymentVerify from "./pages/payment-veirfy";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import Forgot_password from "./pages/Forgot-password";

const App = () => {
  return (
    <div className="overflow-hidden w-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/payment-verify/:merchantOrderId"
          element={<PaymentVerify />}
        />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
        <Route path="/forgot-password" element={<Forgot_password />} />
      </Routes>
    </div>
  );
};

export default App;
