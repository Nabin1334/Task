import { Check, Pencil, Trash2 } from "lucide-react";
export default function TaskTable({ tasks, onRemove, onEdit, onStatusChange }) {
  return (
    <div className="table">
      {tasks.length ? (
        tasks.map((task) => (
          <article className="task-row" key={task.id}>
            <button
              type="button"
              className={`status-dot ${task.status}`}
              onClick={() => onStatusChange(task)}
              aria-label={`Change status for ${task.title}`}
            >
              <Check size={13} />
            </button>
            <div className="task-copy">
              <strong>{task.title}</strong>
              <span>{task.description || "No description"}</span>
            </div>
            <span className={`priority ${task.priority}`}>{task.priority}</span>
            <span className="task-status">{task.status.replace("_", " ")}</span>
            <button
              type="button"
              className="icon-button"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
            >
              <Pencil size={17} />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => onRemove(task.id)}
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 size={17} />
            </button>
          </article>
        ))
      ) : (
        <div className="empty">Nothing here yet. Add a task to get moving.</div>
      )}
    </div>
  );
}
