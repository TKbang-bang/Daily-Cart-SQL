import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./auth.css";
import { signup } from "../services/auth.service";

function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      return toast.error("All fields are required");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await signup(firstname, lastname, email, password);
      if (!res.ok) throw new Error(res.message);

      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

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
        <h1>Sign Up</h1>

        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) =>
            setFirstname(
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
            )
          }
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) =>
            setLastname(
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
            )
          }
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>

        <p className="or">Or</p>

        <p className="link">
          Do you already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;
