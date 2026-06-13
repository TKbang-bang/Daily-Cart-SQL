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

  const handleNext = async (fulfillment_id) => {
    try {
      const res = await updateOrder(fulfillment_id);
      if (!res.ok) throw new Error(res.message);

      setOrders(
        orders.filter((order) => order.fulfillment_id !== fulfillment_id),
      );
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
            <article className="order" key={order.fulfillment_id}>
              <h3>ID: {order.fulfillment_id}</h3>
              <h3>status: {order.fulfillment_status}</h3>
              <h3>stage: {order.fulfillment_stage}</h3>
              <h3>orders: {order.total_orders}</h3>
              <button onClick={() => handleNext(order.fulfillment_id)}>
                Next status
              </button>
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
