import axios from "axios";
import { setAccessToken } from "./token.service";

export const signup = async (
  firstName,
  lastName,
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
      !firstName ||
      !lastName ||
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
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("code", code);
    formData.append("role", role);
    formData.append("image", file);

    // sending the request
    const res = await axios.post("/auth/private/signup", formData);

    // checking if the request was successful
    if (res.status != 200) return { ok: false, message: res.data.message };

    // setting the token
    setAccessToken(res.data.accessToken);

    // if the request was successful
    return { ok: true, message: res.data.message || "User created" };
  } catch (error) {
    // if the request failed
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
    const res = await axios.post("/auth/private/login", {
      email,
      password,
      code,
      role,
    });
    if (res.status != 200) return { ok: false, message: res.data.message };

    // setting the token
    setAccessToken(res.data.accessToken);

    // if the request was successful
    return { ok: true, message: res.data.message || "User logged in" };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
