import React, { useEffect, useState } from "react";
import { gettingOrders, updateOrder } from "../../../services/orders.service";
import { toast } from "sonner";
import "./components.css";

function Orders({ url }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const res = await gettingOrders(`${url}`);
        if (!res.ok) throw new Error(res.message);

        setOrders(res.orders);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    getAllOrders();
  }, [url]);

  const handleNext = async (orderId) => {
    try {
      const res = await updateOrder(orderId);
      if (!res.ok) throw new Error(res.message);

      setOrders(orders.filter((order) => order.id !== orderId));
      return toast.success(res.message);
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <section className="orders">
      {orders.length > 0 ? (
        <>
          {orders.map((order) => (
            <article className="order" key={order.id}>
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/products/${
                  order.items[0].product.image
                }`}
                alt={order.name}
              />

              <h3>{order.items[0].product.name}</h3>
              <h3>
                {order.user.firstname} {order.user.lastname}
              </h3>
              <p>${order.total}</p>
              <p>{order.status}</p>
              <button onClick={() => handleNext(order.id)}>Next status</button>
            </article>
          ))}
        </>
      ) : (
        <p>No orders found</p>
      )}
    </section>
  );
}

export default Orders;
