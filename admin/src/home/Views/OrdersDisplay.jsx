import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Orders from "./components/Orders";
import "./views.css";

function OrdersDisplay() {
  return (
    <section>
      <ul className="orders_links">
        <li>
          <NavLink to={"/orders/paid"}>Paid</NavLink>
        </li>

        <li>
          <NavLink to={"/orders/shipped"}>Shipped</NavLink>
        </li>
      </ul>
      <Routes>
        <Route path="/paid" element={<Orders url={"/orders/private/paid"} />} />
        <Route
          path="/shipped"
          element={<Orders url={"/orders/private/shipped"} />}
        />
      </Routes>
    </section>
  );
}

export default OrdersDisplay;
