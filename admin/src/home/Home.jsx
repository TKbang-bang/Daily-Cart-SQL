import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import CreateProducts from "./Views/CreateProducts";
import ProductsContainer from "./Views/ProductsContainer";
import Edit from "./Views/Edit";
import OrdersDisplay from "./Views/OrdersDisplay";

function Home() {
  return (
    <div className="home">
      <Header />

      <Routes>
        <Route path="*" element={<ProductsContainer />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<CreateProducts />} />
        <Route path="/orders/*" element={<OrdersDisplay />} />
        <Route path="/users" element={<h1>Users</h1>} />
        <Route path="/logs" element={<h1>Logs</h1>} />
      </Routes>
    </div>
  );
}

export default Home;
