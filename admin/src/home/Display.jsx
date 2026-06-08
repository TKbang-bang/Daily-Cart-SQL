import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import Aside from "./Components/Aside.jsx";
import Home from "./Home.jsx";
import "./home.css";
import { gettingUser } from "../services/user.service.js";

export const UserContext = createContext();

function Display() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await gettingUser();
        if (!user.ok) throw new Error(user.message);

        setUser(user.user);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <main className="display">
        <Aside />
        <Home />
      </main>
    </UserContext.Provider>
  );
}

export default Display;
