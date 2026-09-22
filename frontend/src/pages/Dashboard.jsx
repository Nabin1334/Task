import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import TaskStats from "../components/TaskStats";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import TaskFormModal from "../components/TaskFormModal";
import Loader from "../components/Loader";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import useTasks from "../hooks/useTasks";
import { useAuth } from "../context/AuthContext";

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function greetingForUser(name) {
  const hour = new Date().getHours();
  const part =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const who = name?.trim() || "there";
  return `${part}, ${who}`;
}

export default function Dashboard() {
  const { session } = useAuth();
  const tasksSectionRef = useRef(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [actionError, setActionError] = useState("");
  const { tasks, loading, error, refresh, create, update, remove } =
    useTasks(filters);

  const displayName =
    session?.user?.name?.trim() || session?.user?.email?.split("@")[0] || "";

  const handleCreate = async (task) => {
    setActionError("");
    await create(task);
  };

  const handleSave = async (task) => {
    setActionError("");
    if (editingTask) {
      await update(editingTask.id, task);
    } else {
      await create(task);
    }
  };

  const handleStatusChange = async (task) => {
    setActionError("");
    try {
      await update(task.id, {
        status: task.status === "done" ? "todo" : "done",
      });
    } catch (err) {
      setActionError(err.message || "Could not update task");
    }
  };

  const handleRemove = async (id) => {
    setActionError("");
    try {
      await remove(id);
    } catch (err) {
      setActionError(err.message || "Could not delete task");
    }
  };

  const scrollToTasks = () => {
    tasksSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <div className="heading">
          <div>
            <span className="eyebrow">{formatToday()}</span>
            <h1>{greetingForUser(displayName)}</h1>
            <p className="dashboard-lede">
              {tasks.length
                ? `You have ${tasks.filter((t) => t.status !== "done").length} open task${tasks.filter((t) => t.status !== "done").length === 1 ? "" : "s"} in your workspace.`
                : "Your workspace is clear — add a task when you are ready."}
            </p>
          </div>
          <button className="primary add" onClick={() => setEditingTask({})}>
            <Plus size={18} /> New task
          </button>
        </div>

        {(error || actionError) && (
          <div className="banner banner-error" role="alert">
            <span>{error || actionError}</span>
            {error ? (
              <button
                type="button"
                className="text-button inline"
                onClick={refresh}
              >
                Try again
              </button>
            ) : null}
          </div>
        )}

        {loading && !tasks.length ? (
          <Loader />
        ) : (
          <>
            <TaskStats tasks={tasks} />
            <div className="dashboard-panels">
              <RecentActivity tasks={tasks} onFocusTask={scrollToTasks} />
              <QuickActions
                onNewTask={() => setEditingTask({})}
                onFilterStatus={(status) =>
                  setFilters((current) => ({ ...current, status }))
                }
                onFilterPriority={(priority) =>
                  setFilters((current) => ({ ...current, priority }))
                }
              />
            </div>
          </>
        )}

        <div className="list-heading" ref={tasksSectionRef}>
          <h2>Tasks</h2>
          <TaskFilters filters={filters} setFilters={setFilters} />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <TaskTable
            tasks={tasks}
            onRemove={handleRemove}
            onEdit={setEditingTask}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
      {editingTask ? (
        <TaskFormModal
          onClose={() => setEditingTask(null)}
          onSave={handleSave}
          task={editingTask.id ? editingTask : null}
        />
      ) : null}
    </>
  );
}
