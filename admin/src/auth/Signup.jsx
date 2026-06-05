import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { signup } from "../services/auth.service";
import { toast } from "sonner";
import { SwitchIcon, DeleteIcon } from "../SVG/SVG";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("moderator");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sign = await signup(
        firstName,
        lastName,
        email,
        password,
        confPassword,
        code,
        role,
        file,
      );

      if (!sign.ok) throw new Error(sign.message);

      toast.success(sign.message);
      navigate("/products");
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit}>
        <section className="img">
          {/* display none */}
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            ref={fileRef}
          />
          {/* display none */}

          {file ? (
            <>
              <img src={URL.createObjectURL(file)} alt="" />
              <div className="btns">
                <span
                  onClick={() => fileRef.current.click()}
                  className="switch"
                >
                  <SwitchIcon />
                </span>
                <span
                  onClick={() => (
                    setFile(null),
                    (document.getElementById("file").value = "")
                  )}
                  className="delete"
                >
                  <DeleteIcon />
                </span>
              </div>
            </>
          ) : (
            <label htmlFor="file">
              <span>+</span>
              <p>Upload a photo</p>
            </label>
          )}
        </section>

        <section className="credentials">
          <h1>Sign up</h1>

          <div className="name">
            <article className="feild_container">
              <label htmlFor="firstname">First name</label>
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) =>
                  setFirstName(
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  )
                }
              />
            </article>

            <article className="feild_container">
              <label htmlFor="lastname">Last name</label>
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) =>
                  setLastName(
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  )
                }
              />
            </article>
          </div>

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
            <label htmlFor="conf-password">Confirm your password</label>
            <input
              type="password"
              id="conf-password"
              maxLength={12}
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
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
            Sign up
          </button>

          <p className="or">Or</p>

          <p className="other">
            Already have an account? <Link to={"/login"}>Log in</Link>
          </p>
        </section>
      </form>
    </div>
  );
}

export default Signup;
