import React, { useState } from "react";
import "./components.css";
import { toast } from "sonner";
import { theCartThing } from "../../services/products.service";

function Product({ product }) {
  const [inCart, setInCart] = useState(product.inCart);

  const handleCart = async () => {
    try {
      const res = await theCartThing(product.id);
      if (!res.ok) throw new Error(res.message);

      if (res.added) {
        product.inCart = true;
        setInCart(true);
      } else {
        product.inCart = false;
        setInCart(false);
      }

      toast.success(res.message);
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <article className="product">
      <img
        src={`${import.meta.env.VITE_SERVER_URL}/products/${product.image}`}
        alt={product.name}
      />
      <div className="info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="_price">
          {product.discount ? (
            <>
              <span className="red">${product.price}</span>
              <span className="price">${product.price - product.discount}</span>
            </>
          ) : (
            <span className="price">${product.price}</span>
          )}{" "}
        </p>
        <p>{product.stock} in stock</p>
      </div>

      <div className="btns">
        <button className="to_cart" onClick={handleCart}>
          {inCart ? "Remove from cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default Product;
