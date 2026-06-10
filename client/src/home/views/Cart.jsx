import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import CartProducts from "../components/CartProducts";
import "./views.css";

function Cart() {
  return (
    <section className="_cart home">
      <ul className="_categories">
        <li>
          <NavLink to="/cart/current">Current</NavLink>
        </li>
        <li>
          <NavLink to="/cart/orders">Orders</NavLink>
        </li>
        <li>
          <NavLink to="/cart/purchased">Purchased</NavLink>
        </li>
      </ul>

      <Routes>
        <Route
          path="current"
          element={<CartProducts url="/cart/current" current={true} />}
        />
        <Route
          path="orders"
          element={<CartProducts url="/orders" current={false} />}
        />
        <Route
          path="purchased"
          element={<CartProducts url="/cart/purchased" current={false} />}
        />
      </Routes>
    </section>
  );
}

export default Cart;
