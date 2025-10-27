import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./views.css";
import Products from "../components/Products";
import { ArrowBackIcon } from "../../utils/SVG";

function Search() {
  const { word } = useParams();
  const navigate = useNavigate();

  return (
    <section className="_search">
      <button onClick={() => navigate(-1)} className="back">
        <ArrowBackIcon />
      </button>
      <Products url={`/products/search/${word}`} />
    </section>
  );
}

export default Search;
