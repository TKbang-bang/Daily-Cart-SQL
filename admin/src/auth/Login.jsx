import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { login } from "../services/auth.service";
import { toast } from "sonner";
import { getAccessToken } from "../services/token.service";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("moderator");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password, code, role);
      if (!res.ok) throw new Error(res.message);

      toast.success(res.message);
      navigate("/products");
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit}>
        <section className="credentials">
          <h1>Log in</h1>

          <article className="feild_container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </article>

          <article className="feild_container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              maxLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </article>

          <article className="feild_container">
            <label htmlFor="code">Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </article>

          <article className="feild_container">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </article>

          <button type="submit" className="submit">
            Log in
          </button>

          <p className="or">Or</p>

          <p className="other">
            Don't have an account yet? <Link to={"/signup"}>Sign up</Link>
          </p>
        </section>
      </form>
    </div>
  );
}

export default Login;
