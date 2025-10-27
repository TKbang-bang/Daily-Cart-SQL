import React, { useEffect } from "react";
import { toast } from "sonner";
import { getLogs } from "../../services/user.service";

function Logs() {
  useEffect(() => {
    const gettingLogs = async () => {
      try {
        const res = await getLogs();
        if (!res.ok) throw new Error(res.message);

        console.log(res.logs);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    gettingLogs();
  }, []);

  return (
    <section className="logs">
      <h1>Logs</h1>
    </section>
  );
}

export default Logs;
