import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Cart, MenuBars, Search, XClose } from "../../utils/SVG";
import "./components.css";
import { toast } from "sonner";
import { gettingCartCount } from "../../services/products.service";

function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const getCartCount = async () => {
      try {
        const res = await gettingCartCount();
        if (!res.ok) throw new Error(res.message);

        setCartCount(res.count);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    getCartCount();
  }, []);

  return (
    <header>
      <div className="up">
        <Link to={"/products"} className="logo">
          <h1>DailyMarket</h1>
        </Link>

        <article className="mobile">
          <span
            className="bars"
            onClick={() => (
              document
                .getElementsByClassName("mobile")[0]
                .classList.add("active"),
              document.getElementsByClassName("nav")[0].classList.add("active")
            )}
          >
            <MenuBars />
          </span>
          <span
            className="close"
            onClick={() => (
              document
                .getElementsByClassName("mobile")[0]
                .classList.remove("active"),
              document
                .getElementsByClassName("nav")[0]
                .classList.remove("active")
            )}
          >
            <XClose />
          </span>
        </article>

        <nav className="nav">
          <ul className="menu">
            <li>
              <NavLink to={"/products"}>Home</NavLink>
            </li>
            <li>
              <NavLink to={"/about"}>About us</NavLink>
            </li>
            <li>
              <NavLink to={"/contact"}>Contact</NavLink>
            </li>
          </ul>

          <Link to={"/cart/current"} className="cart">
            <Cart />
            <span className="count">{cartCount}</span>
          </Link>
        </nav>
      </div>
      <article className="search">
        <form>
          <input type="text" placeholder="Search..." />
          <button type="submit">
            <Search />
          </button>
        </form>
      </article>
    </header>
  );
}

export default Header;
