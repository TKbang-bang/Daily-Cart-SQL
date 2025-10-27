import React from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Cart from "./views/Cart";
import Search from "./views/Search";
import Plus from "./Plus";

function Display() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/cart/*" element={<Cart />} />
        <Route path="/search/:word" element={<Search />} />
        <Route path="/contact" element={<Plus />} />
        <Route path="/about" element={<Plus />} />
      </Routes>
    </>
  );
}

export default Display;
