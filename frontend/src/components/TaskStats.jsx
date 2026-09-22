function isOverdue(task) {
  if (!task.due_date || task.status === "done") return false;
  const due = new Date(`${task.due_date}T23:59:59`);
  if (Number.isNaN(due.getTime())) return false;
  return due < new Date();
}

export default function TaskStats({ tasks }) {
  const open = tasks.filter((t) => t.status !== "done");
  const stats = [
    { label: "Open tasks", value: open.length },
    {
      label: "In progress",
      value: tasks.filter((t) => t.status === "in_progress").length,
    },
    {
      label: "Completed",
      value: tasks.filter((t) => t.status === "done").length,
    },
    {
      label: "High priority",
      value: open.filter((t) => t.priority === "high").length,
    },
    {
      label: "Overdue",
      value: open.filter(isOverdue).length,
    },
  ];

  return (
    <section className="stats" aria-label="Task summary">
      {stats.map((stat) => (
        <div className="stat" key={stat.label}>
          <small>{stat.label}</small>
          <strong>{stat.value}</strong>
        </div>
      ))}
    </section>
  );
}
