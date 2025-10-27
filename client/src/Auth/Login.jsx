import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./auth.css";
import { login } from "../services/auth.service";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    try {
      const res = await login(email, password);
      if (!res.ok) throw new Error(res.message);

      setEmail("");
      setPassword("");

      toast.success(res.message);
      navigate("/");
      return window.location.reload();
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <section className="auth">
      <form onSubmit={handleSubmit}>
        <h1>Log In</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>

        <p className="or">Or</p>

        <p className="link">
          Don't have an account yet? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
