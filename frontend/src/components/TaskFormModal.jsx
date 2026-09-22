import { X } from "lucide-react";
import { useState } from "react";

export default function TaskFormModal({ onClose, onSave, task = null }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    status: task?.status || "todo",
    due_date: task?.due_date || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="modal-backdrop">
      <form
        className="modal"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setError("");
          try {
            await onSave(form);
            onClose();
          } catch (err) {
            setError(err.message || "Could not create task");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <button
          type="button"
          className="close"
          onClick={onClose}
          aria-label="Close"
        >
          <X />
        </button>
        <p className="eyebrow">{task ? "Update item" : "New item"}</p>
        <h2>{task ? "Edit task" : "Capture a task"}</h2>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <label>
          Title
          <input
            name="title"
            required
            autoFocus
            value={form.title}
            onChange={update}
            disabled={submitting}
          />
        </label>
        <label>
          Details
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={update}
            disabled={submitting}
          />
        </label>
        <label>
          Priority
          <select
            name="priority"
            value={form.priority}
            onChange={update}
            disabled={submitting}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label>
          Status
          <select
            name="status"
            value={form.status}
            onChange={update}
            disabled={submitting}
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Due date
          <input
            type="date"
            name="due_date"
            value={form.due_date || ""}
            onChange={update}
            disabled={submitting}
          />
        </label>
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : task ? "Save changes" : "Create task"}
        </button>
      </form>
    </div>
  );
}
