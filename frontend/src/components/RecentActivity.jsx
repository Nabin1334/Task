import { Check } from "lucide-react";

function formatWhen(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RecentActivity({ tasks, onFocusTask }) {
  const recent = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updated_at || 0).getTime() -
        new Date(a.updated_at || 0).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="panel recent-panel" aria-labelledby="recent-heading">
      <div className="panel-head">
        <h2 id="recent-heading">Recent activity</h2>
        <p>Latest updates across your workspace</p>
      </div>
      {recent.length ? (
        <ul className="recent-list">
          {recent.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                className="recent-item"
                onClick={() => onFocusTask?.()}
              >
                <span className={`status-dot ${task.status || "todo"}`}>
                  <Check size={13} />
                </span>
                <span className="recent-copy">
                  <strong>{task.title || "Untitled task"}</strong>
                  <span>
                    {task.status?.replace("_", " ") || "todo"} ·{" "}
                    {formatWhen(task.updated_at)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="panel-empty">Updates will show here once you add tasks.</p>
      )}
    </section>
  );
}
