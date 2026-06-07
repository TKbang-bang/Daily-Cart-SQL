import api from "./api.service";
import axios from "axios";
import { getAccessToken, setAccessToken } from "./token.service";

export const sessionCheck = async () => {
  try {
    const token = getAccessToken();
    const res = await axios.get("/auth/check", {
      withCredentials: true,
      headers: {
        Authorization: token && `Bearer ${token}`,
      },
    });
    if (res.status != 200) return { ok: false, message: res.data.message };

    setAccessToken(res.headers["access-token"].split(" ")[1]);

    return { ok: true, message: res.data.message };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const logout = async () => {
  try {
    const res = await api.get("/auth/logout");
    if (res.status != 204) return { ok: false, message: res.data.message };

    return { ok: true, message: "User logged out" };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
