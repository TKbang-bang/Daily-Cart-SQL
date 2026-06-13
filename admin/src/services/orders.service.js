import api from "./api.service";

export const gettingOrders = async (url) => {
  try {
    const res = await api.get(`${url}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, orders: res.data.orders };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const updateOrder = async (fulfillment_id) => {
  try {
    const res = await api.put(`/orders/${fulfillment_id}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, message: res.data.message };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
