import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Orders from "./components/Orders";
import "./views.css";

function OrdersDisplay() {
  return (
    <section>
      <ul className="orders_links">
        <li>
          <NavLink to={"/orders/processing"}>Processing</NavLink>
        </li>

        <li>
          <NavLink to={"/orders/packed"}>Packed</NavLink>
        </li>

        <li>
          <NavLink to={"/orders/shipped"}>Shipped</NavLink>
        </li>
      </ul>
      <Routes>
        <Route
          path="/processing"
          element={<Orders url={"/orders/processing"} />}
        />
        <Route path="/packed" element={<Orders url={"/orders/packed"} />} />
        <Route path="/shipped" element={<Orders url={"/orders/shipped"} />} />
      </Routes>
    </section>
  );
}

export default OrdersDisplay;
