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
  const [quantity, setQuantity] = useState(1);
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
      const res = await buyProduct(id, quantity);
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
        products.map((product, index) => (
          <article className="product" key={index + product.id}>
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/products/${
                product.image
              }`}
              alt={product.name}
            />
            <div className="info">
              <h3>{product.name}</h3>
              {current != "purchased" && <p>{product.description}</p>}
              {current != "purchased" && (
                <p className="_price">
                  {product.discount_percent ? (
                    <>
                      <span className="red">Price: ${product.price}</span>
                      <span className="price">
                        Discounted Price: $
                        {product.price -
                          (product.price * product.discount_percent) / 100}
                      </span>
                    </>
                  ) : (
                    <span className="price">Price: ${product.price}</span>
                  )}{" "}
                </p>
              )}
              {current != "orders" && current != "purchased" && (
                <p>Stock: {product.stock}</p>
              )}
              {current == "orders" && <p>Quantity: {product.quantity}</p>}
              {current == "orders" && <p>Total: {product.total}</p>}
              {current == "orders" && <p>Status: {product.status}</p>}
            </div>

            {current == "current" && (
              <div className="btns">
                <input
                  className="quantity"
                  readOnly
                  type="number"
                  value={quantity}
                />

                <div className="btns_quantity">
                  <button
                    className="minus"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <button
                    className="plus"
                    onClick={() => quantity < 5 && setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="to_cart"
                  onClick={() => handleBuy(product.id)}
                >
                  Buy now
                </button>

                <button
                  className="now"
                  onClick={() => handleDelete(product.id)}
                >
                  Remove from cart
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
