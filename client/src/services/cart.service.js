import api from "./api.service";

export const getCartProducts = async (url) => {
  try {
    const res = await api.get(`${url}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, products: res.data.products };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const deleteCartProduct = async (id) => {
  try {
    const res = await api.delete(`/cart/${id}`);
    if (res.status != 204) return { ok: false, message: res.data.message };

    return { ok: true, message: "Product removed from cart" };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
