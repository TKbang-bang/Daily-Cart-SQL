import api from "./api.service";

export const getAllProducts = async (url) => {
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

export const gettingCategories = async () => {
  try {
    const res = await api.get("/products/categories");
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, categories: res.data.categories };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const theCartThing = async (id) => {
  try {
    const res = await api.post(`/products/cart/${id}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return {
      ok: true,
      added: res.data.added,
      message: res.data.added
        ? "Product added to cart"
        : "Product removed from cart",
    };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const gettingCartCount = async () => {
  try {
    const res = await api.get("/products/cart/count");
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, count: res.data.count };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const buyProduct = async (id) => {
  try {
    const res = await api.post(`/payment/session/${id}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, url: res.data.url };
  } catch (error) {
    // console.log(error);
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const orderSuccess = async (orderId) => {
  try {
    const res = await api.post(`/payment/success/${orderId}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, message: res.data.message };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const orderCancelled = async (orderId) => {
  try {
    const res = await api.post(`/payment/cancel/${orderId}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, message: res.data.message };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
