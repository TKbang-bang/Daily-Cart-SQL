import bcrypt from "bcrypt";
import pool from "../db/db.js";
import ServerError from "../errors/server.error.js";

export const privateSignupService = async (
  firstname,
  lastname,
  email,
  password,
  code,
  role,
  filename,
) => {
  // verifying if the user email is in db
  const { rows: userByEmail } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  if (userByEmail.length > 0)
    throw new ServerError("Email already in use", 409);

  // check if the code and role are valid
  if (!code || !role) throw new ServerError("Code and role are required", 409);

  if (role !== "manager" && role !== "admin")
    throw new ServerError("Invalid role", 409);

  let isCodeOkay = false;
  if (role == "manager" && code == process.env.MANAGER_CODE) isCodeOkay = true;
  if (role == "admin" && code == process.env.ADMIN_CODE) isCodeOkay = true;
  if (!isCodeOkay) throw new ServerError("Invalid code", 409);

  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // creating the user
  const client = await pool.connect();
  try {
    // starting the transaction
    await client.query("BEGIN");

    // user
    const { rows: user } = await client.query(
      `INSERT INTO users (
            firstname,
            lastname,
            email,
            password
        ) VALUES ($1, $2, $3, $4) RETURNING *`,
      [firstname, lastname, email, hashedPassword],
    );
    // adding user into the staff table
    await client.query(
      `INSERT INTO staff_members (
            user_id,
            role,
            profile
        ) VALUES ($1, $2, $3)`,
      [user[0].id, role, filename],
    );

    // commiting the transaction
    await client.query("COMMIT");

    return user[0];
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof ServerError) throw error;
    throw new ServerError("Internal server error", 500);
  } finally {
    client.release();
  }
};

export const privateSigninService = async (email, password, code, role) => {
  // check if the email is in db
  const { rows: user } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  if (user.length === 0) throw new ServerError("User not found", 404);

  // check if the code and role are valid
  if (!code || !role) throw new ServerError("Code and role are required", 409);

  if (role !== "manager" && role !== "admin")
    throw new ServerError("Invalid role", 409);

  let isCodeOkay = false;
  if (role == "manager" && code == process.env.MANAGER_CODE) isCodeOkay = true;
  if (role == "admin" && code == process.env.ADMIN_CODE) isCodeOkay = true;
  if (!isCodeOkay) throw new ServerError("Invalid code", 409);

  // check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
  if (!isPasswordCorrect) throw new ServerError("Incorrect password", 401);

  return user[0];
};
