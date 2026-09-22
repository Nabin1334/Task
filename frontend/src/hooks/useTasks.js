import { useCallback, useEffect, useState } from "react";
import { request } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function useTasks(filters) {
  const { session } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!session?.token) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(
        Object.entries(filters).filter(([, value]) => value),
      );
      const data = await request(`/tasks/?${query}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      setTasks(Array.isArray(data?.tasks) ? data.tasks : []);
    } catch (err) {
      setTasks([]);
      setError(err.message || "Could not load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters, session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (task) => {
    const data = await request("/tasks/", {
      method: "POST",
      body: JSON.stringify(task),
      headers: { Authorization: `Bearer ${session.token}` },
    });
    await refresh();
    return data;
  };

  const update = async (id, task) => {
    const data = await request(`/tasks/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(task),
      headers: { Authorization: `Bearer ${session.token}` },
    });
    await refresh();
    return data;
  };

  const remove = async (id) => {
    const data = await request(`/tasks/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.token}` },
    });
    await refresh();
    return data;
  };

  return { tasks, loading, error, refresh, create, update, remove };
}
