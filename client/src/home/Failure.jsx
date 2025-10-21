import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { orderCancelled } from "../services/products.service";
import "./home.css";

function Failure() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const res = await orderCancelled(orderId);
        if (!res.ok) throw new Error(res.message);

        return toast.success(res.message);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    handleSuccess();
    navigate("/cart/current");
    window.location.reload();
  }, []);

  return (
    <div className="payment">
      <h1>Wait a moment...</h1>
    </div>
  );
}

export default Failure;
