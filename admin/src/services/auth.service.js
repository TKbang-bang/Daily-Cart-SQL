import axios from "axios";
import { setAccessToken } from "./token.service";

export const signup = async (
  firstname,
  lastname,
  email,
  password,
  confPassword,
  code,
  role,
  file,
) => {
  try {
    // check if all fields are filled
    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confPassword ||
      !code ||
      !role ||
      !file
    )
      return { ok: false, message: "All fields are required" };

    // check if password and confPassword are the same
    if (password !== confPassword)
      return { ok: false, message: "Passwords do not match" };

    // creating form data with all the data
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("code", code);
    formData.append("role", role);
    formData.append("image", file);

    const res = await axios.post("/auth/private/signup", formData);
    if (res.status != 201) return { ok: false, message: res.data.message };

    // setting the token
    setAccessToken(res.headers["access-token"]);

    return { ok: true, message: res.data.message || "User created" };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const login = async (email, password, code, role) => {
  try {
    // check if all fields are filled
    if (!email || !password || !code || !role)
      return { ok: false, message: "All fields are required" };

    // sending the request
    const res = await axios.post("/auth/private/signin", {
      email,
      password,
      code,
      role,
    });
    if (res.status != 201) return { ok: false, message: res.data.message };

    // setting the token
    setAccessToken(res.headers["access-token"]);

    // if the request was successful
    return { ok: true, message: res.data.message || "User logged in" };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
