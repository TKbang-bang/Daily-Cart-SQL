import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllProducts } from "../../services/products.service";
import Product from "./Product";
import "./components.css";

function Products({ url }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts(url);
        if (!res.ok) throw new Error(res.message);

        setProducts(res.products);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    fetchProducts();
  }, [url]);

  return (
    <section className="products">
      {products.length > 0 ? (
        products.map((product) => (
          <Product key={product.id} product={product} />
        ))
      ) : (
        <h1>No results...</h1>
      )}
    </section>
  );
}

export default Products;
