import api from "./api.service";

export const createProduct = async (
  name,
  description,
  category,
  price,
  stock,
  tags,
  file
) => {
  try {
    const allTags = tags.split(",").map((tag) => tag.trim());
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("tags", JSON.stringify(allTags));
    formData.append("image", file);

    const res = await api.post("/products/private", formData);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, message: res.data.message };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const gettingProducts = async (to) => {
  try {
    const res = await api.get(`${to}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, products: res.data.products };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const gettingProductById = async (to) => {
  try {
    const res = await api.get(`${to}`);
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, product: res.data.product };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const updateProduct = async (
  id,
  name,
  description,
  category,
  price,
  discount,
  stock,
  tags
) => {
  try {
    const allTags = tags.split(",").map((tag) => tag.trim());

    const res = await api.put(`/products/private/${id}`, {
      name,
      description,
      category,
      price,
      discount,
      stock,
      tags: allTags,
    });
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, message: res.data.message };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
