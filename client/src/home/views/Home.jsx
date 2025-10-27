import React, { useEffect, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "./views.css";
import Products from "../components/Products";
import { toast } from "sonner";
import { gettingCategories } from "../../services/products.service";

function Home() {
  const [categories, setCategories] = useState([]);
  const [theUrl, setTheUrl] = useState("/products/categories/all");
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await gettingCategories();
        if (!res.ok) throw new Error(res.message);

        setCategories(res.categories);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    getCategories();
    navigate(theUrl);
  }, []);

  return (
    <section className="home">
      <section className="prev">
        <img src="/super-market.jpg" alt="" />
        <div className="overlay">
          <div className="overlay-content">
            <h1>Welcome to DailyMarket</h1>
            <p>
              Fresh groceries, everyday essentials, and the best prices right at
              your fingertips. Experience shopping made simple and fast.
            </p>
            <p>
              Enjoy seasonal fruits, organic vegetables, quality meats, and a
              wide variety of household products all in one place.
            </p>
          </div>
        </div>
      </section>

      <ul className="_categories">
        <li>
          <NavLink
            to="/products/categories/all"
            onClick={() => setTheUrl("/products")}
          >
            All
          </NavLink>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <NavLink
              to={`/products/categories/${category.name}`}
              onClick={() => setTheUrl(`/products/categories/${category.name}`)}
            >
              {category.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <Routes>
        <Route path="/products/*" element={<Products url={theUrl} />} />
      </Routes>
    </section>
  );
}

export default Home;
