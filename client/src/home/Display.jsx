import React from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Cart from "./views/Cart";

function Display() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/cart/*" element={<Cart />} />
      </Routes>
    </>
  );
}

export default Display;
