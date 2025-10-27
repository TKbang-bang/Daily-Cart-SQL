import api from "./api.service";

export const gettingUser = async () => {
  try {
    const res = await api.get("/users/me");
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, user: res.data.user };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const gettingUsers = async () => {
  try {
    const res = await api.get("/users/managers");
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, users: res.data.users };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getLogs = async () => {
  try {
    const res = await api.get("/users/logs");
    if (res.status != 200) return { ok: false, message: res.data.message };

    return { ok: true, logs: res.data.logs };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
