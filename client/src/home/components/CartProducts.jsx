import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteCartProduct,
  getCartProducts,
} from "../../services/cart.service";
import { buyProduct } from "../../services/products.service";
import { useNavigate } from "react-router-dom";

function CartProducts({ url, current }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getCartProducts(url);
        if (!res.ok) throw new Error(res.message);

        setProducts(res.products);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    fetchProducts();
  }, [url]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteCartProduct(id);
      if (!res.ok) throw new Error(res.message);

      const newProducts = products.filter((product) => product.id !== id);
      setProducts(newProducts);
      return toast.success(res.message);
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleBuy = async (id) => {
    try {
      const res = await buyProduct(id);
      if (!res.ok) throw new Error(res.message);

      // return window.open(res.session.url, "_blank");
      window.location.href = res.url;
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <section className="products">
      {products.length > 0 ? (
        products.map((product) => (
          <article className="product" key={product.id}>
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/products/${
                product.image
              }`}
              alt={product.name}
            />
            <div className="info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="_price">
                {product.discount ? (
                  <>
                    <span className="red">${product.price}</span>
                    <span className="price">
                      ${product.price - product.discount}
                    </span>
                  </>
                ) : (
                  <span className="price">${product.price}</span>
                )}{" "}
              </p>
              <p>{product.stock} in stock</p>
            </div>

            {current && (
              <div className="btns">
                <button
                  className="to_cart"
                  onClick={() => handleDelete(product.id)}
                >
                  Remove from cart
                </button>
                <button className="now" onClick={() => handleBuy(product.id)}>
                  Buy now
                </button>
              </div>
            )}
          </article>
        ))
      ) : (
        <h1>No products...</h1>
      )}
    </section>
  );
}

export default CartProducts;
