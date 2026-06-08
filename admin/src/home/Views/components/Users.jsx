import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { gettingUsers } from "../../../services/user.service";
import "./components.css";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await gettingUsers();
        if (!res.ok) throw new Error(res.message);

        setUsers(res.users);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    getUsers();
  }, []);

  return (
    <section className="_users">
      {users && users.length > 0 ? (
        <>
          {users.map((user) => (
            <article key={user.id} className="_user">
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/profiles/${
                  user.profile
                }`}
                alt={`${user.firstname} ${user.lastname}`}
              />
              <div className="down">
                <h3>
                  {user.firstname} {user.lastname}
                </h3>
              </div>
            </article>
          ))}
        </>
      ) : (
        <p>No users found</p>
      )}
    </section>
  );
}

export default Users;
