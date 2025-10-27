import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Cart, MenuBars, Search, XClose } from "../../utils/SVG";
import "./components.css";
import { toast } from "sonner";
import { gettingCartCount } from "../../services/products.service";
import { logout } from "../../services/session.service";

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [searchWord, setSearchWord] = useState("");

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

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchWord) return toast.error("The search field can not be empty");

    return navigate(`/search/${searchWord}`);
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (!res.ok) throw new Error(res.message);

      navigate("/login");
      return window.location.reload();
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <header>
      <div className="up">
        <Link to={"/products/categories/all"} className="logo">
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
              <NavLink to={"/products/categories/all"}>Home</NavLink>
            </li>
            <li>
              <NavLink to={"/about"}>About us</NavLink>
            </li>
            <li>
              <NavLink to={"/contact"}>Contact</NavLink>
            </li>
            <li className="out">
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </ul>

          <Link to={"/cart/current"} className="cart">
            <Cart />
            <span className="count">{cartCount}</span>
          </Link>
        </nav>
      </div>
      <article className="search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <button type="submit">
            <Search />
          </button>
        </form>
      </article>
    </header>
  );
}

export default Header;
