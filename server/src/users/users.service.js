import pool from "../db/db.js";

export const getMeService = async (userID) => {
  // check if user id is in db
  const { rows: userByID } = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [userID],
  );
  if (userByID.length === 0) throw new ServerError("User not found", 404);

  // check if the user is a staff member
  const { rows: staffUser } = await pool.query(
    "SELECT * FROM staff_members WHERE user_id = $1",
    [userID],
  );
  if (staffUser.length === 0) throw new ServerError("You are not allowed", 401);

  // getting user
  const { rows: user } = await pool.query(
    `
    SELECT
        u.*,
        sm.role,
        sm.profile
    FROM users u
    JOIN staff_members sm ON u.id = sm.user_id
    WHERE u.id = $1
    `,
    [userID],
  );

  return user[0];
};

export const getManagersService = async (userID) => {
  // check if the user is admin
  const { rows: staffUser } = await pool.query(
    "SELECT * FROM staff_members WHERE user_id = $1",
    [userID],
  );
  if (staffUser.length === 0) throw new ServerError("Member not found", 404);

  if (staffUser[0].role !== "admin")
    throw new ServerError("You are not allowed", 401);

  // getting managers
  const { rows: managers } = await pool.query(
    `
      SELECT
          u.*,
          sm.role,
          sm.profile
      FROM users u
      JOIN staff_members sm ON u.id = sm.user_id
      WHERE sm.role = 'manager'
      `,
  );

  return managers;
};

export const getLogsService = async (userID) => {
  // check if the user is admin
  const { rows: staffUser } = await pool.query(
    "SELECT * FROM staff_members WHERE user_id = $1",
    [userID],
  );
  if (staffUser.length === 0) throw new ServerError("Member not found", 404);

  if (staffUser[0].role !== "admin")
    throw new ServerError("You are not allowed", 401);

  // getting logs
  const { rows: logs } = await pool.query(`SELECT * FROM logs`);

  return logs;
};
