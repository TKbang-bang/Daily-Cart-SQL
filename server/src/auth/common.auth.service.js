import bcrypt from "bcrypt";
import pool from "../db/db.js";
import ServerError from "../errors/server.error.js";

export const commonSignupService = async (
  firstname,
  lastname,
  email,
  password,
) => {
  // verifying if the user email is in db
  const { rows: userByEmail } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  if (userByEmail.length > 0)
    throw new ServerError("Email already in use", 409);

  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // creating the user
  const { rows: user } = await pool.query(
    "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [firstname, lastname, email, hashedPassword],
  );

  return user[0];
};

export const commonSigninService = async (email, password) => {
  // check if the email is in db
  const { rows: user } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  if (user.length === 0) throw new ServerError("User not found", 404);

  // check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
  if (!isPasswordCorrect) throw new ServerError("Incorrect password", 401);

  return user[0];
};
