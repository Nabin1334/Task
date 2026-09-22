import { Filter, Plus, Zap } from "lucide-react";

export default function QuickActions({ onNewTask, onFilterStatus, onFilterPriority }) {
  return (
    <section className="panel quick-panel" aria-labelledby="quick-heading">
      <div className="panel-head">
        <h2 id="quick-heading">Quick actions</h2>
        <p>Jump into common workflows</p>
      </div>
      <div className="quick-actions">
        <button type="button" className="quick-action" onClick={onNewTask}>
          <Plus size={18} />
          New task
        </button>
        <button
          type="button"
          className="quick-action"
          onClick={() => onFilterStatus("in_progress")}
        >
          <Filter size={18} />
          In progress
        </button>
        <button
          type="button"
          className="quick-action"
          onClick={() => onFilterPriority("high")}
        >
          <Zap size={18} />
          High priority
        </button>
      </div>
    </section>
  );
}
