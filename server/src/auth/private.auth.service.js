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
  const { rows: user } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  if (user.length > 0) throw new ServerError("Email already in use", 409);

  // check if the code and role are valid
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
            picture
        ) VALUES ($1, $2, $3)`,
      [user[0].id, role, filename],
    );

    // commiting the transaction
    await client.query("COMMIT");

    return user[0];
  } catch (error) {
    client.query("ROLLBACK");
    throw new ServerError(error.message, 500);
  } finally {
    client.release();
  }
};
