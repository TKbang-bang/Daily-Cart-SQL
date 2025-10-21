import axios from "axios";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import { Toaster } from "sonner";
import { sessionCheck } from "./services/session.service";
import Display from "./home/Display.jsx";
import Success from "./home/Success.jsx";
import Failure from "./home/Failure.jsx";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_URL}`;

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const check = await sessionCheck();
        if (!check.ok) throw new Error(check.message);

        return;
      } catch (error) {
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/signup"
        )
          navigate("/login");
      }
    };

    checkAuth();
    if (window.location.pathname === "/") navigate("/products");
  }, []);

  return (
    <>
      <Routes>
        <Route path="*" element={<Display />} />
        <Route path="/payment/success/:orderId" element={<Success />} />
        <Route path="/payment/failure/:orderId" element={<Failure />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <Toaster position="top-center" richColors={true} />
    </>
  );
}

export default App;
